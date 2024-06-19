import { getServerUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { questionBankTable, questionTable } from "@/lib/schema/questions";
import { commonQuestionSchema } from "@/lib/validation";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const reqBody = await req.json();
  const auth = await getServerUser();
  if (!auth?.user) {
    return NextResponse.json({ message: "unauthorized" }, { status: 401 });
  }

  const parsedBody = await commonQuestionSchema.safeParseAsync(reqBody);
  if (!parsedBody.success) {
    return NextResponse.json(
      { message: "invalid question body", error: parsedBody.error },
      { status: 400 }
    );
  }

  // save to db
  const data = parsedBody.data;

  const questionBank = await db.query.questionBankTable.findFirst({
    where: eq(questionBankTable.id, data.questionBankId),
    columns: {
      userId: true,
      id: true,
    },
  });

  if (!questionBank) {
    return NextResponse.json(
      { message: "Invalid question bank id" },
      { status: 400 }
    );
  }

  if (questionBank.userId !== auth.user.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // save to db

  if (data.type === "MCQ" || data.type === "MSQ") {
    await db.insert(questionTable).values({
      correctAnswer: data.correctAnswer,
      question: data.question,
      questionBankId: data.questionBankId,
      type: data.type,
      options: data.options,
    });
  } else if (data.type === "NUMERIC") {
    await db.insert(questionTable).values({
      correctAnswer: data.correctAnswer,
      question: data.question,
      questionBankId: data.questionBankId,
      type: data.type,
      options: data.options ?? null,
    });
  } else {
    return NextResponse.json(
      { message: "Invalid question type" },
      { status: 400 }
    );
  }

  revalidatePath(`/api/qbank/${questionBank.id}`, "page");
  return NextResponse.json({ message: "success" });
};
