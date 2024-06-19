import { getServerUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { contributionTable, questionTable } from "@/lib/schema/questions";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const acceptContributionSchema = z.object({
  accept: z.boolean(),
});

export const POST = async (
  req: NextRequest,
  {
    params,
  }: {
    params: {
      contributionid: string;
    };
  }
) => {
  const requestBody = await req.json();
  const auth = await getServerUser();
  if (!auth?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const parsedBody = await acceptContributionSchema.safeParseAsync(requestBody);
  if (!parsedBody.success) {
    return NextResponse.json(
      { message: "Invalid request body" },
      { status: 400 }
    );
  }

  const data = parsedBody.data;

  const contribution = await db.query.contributionTable.findFirst({
    where: and(
      eq(contributionTable.id, params.contributionid),
      eq(contributionTable.status, "pending")
    ),
    with: {
      questionBank: {
        with: {
          userId: true,
        },
      },
    },
  });

  if (!contribution) {
    return NextResponse.json(
      { message: "Contribution not found" },
      { status: 404 }
    );
  }

  if (contribution.questionBank.userId.id !== auth.user.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (data.accept) {
    if (contribution.contributionType === "create") {
      await db.insert(questionTable).values({
        questionBankId: contribution.questionBankId,
        question: contribution.question,
        type: contribution.type,
        options: contribution.options,
        correctAnswer: contribution.correctAnswer,
      });
    } else if (contribution.contributionType === "edit") {
      await db
        .update(questionTable)
        .set({
          question: contribution.question,
          options: contribution.options,
          correctAnswer: contribution.correctAnswer,
        })
        .where(eq(questionTable.id, contribution.prevQuestionId));
    }

    await db
      .update(contributionTable)
      .set({
        status: "approved",
      })
      .where(eq(contributionTable.id, params.contributionid));
  } else {
    await db
      .update(contributionTable)
      .set({
        status: "rejected",
      })
      .where(eq(contributionTable.id, params.contributionid));
  }

  revalidatePath(
    `/qbanks/${contribution.questionBankId}/contributions`,
    "page"
  );
  revalidatePath(`/qbanks/${contribution.questionBankId}/`, "page");
  return NextResponse.json({ message: "success" });
};
