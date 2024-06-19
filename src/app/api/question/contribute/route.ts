import { getServerUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { contributionTable, questionBankTable } from "@/lib/schema/questions";
import { commonQuestionSchema } from "@/lib/validation";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const requestBody = await req.json();
  const auth = await getServerUser();
  if (!auth?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const parsedBody = await commonQuestionSchema.safeParseAsync(requestBody);
  if (!parsedBody.success) {
    return NextResponse.json(
      { message: "Invalid request body" },
      { status: 400 }
    );
  }

  const data = parsedBody.data;

  const questionBank = await db.query.questionBankTable.findFirst({
    where: eq(questionBankTable.id, data.questionBankId),
    columns: {
      id: true,
    },
  });

  if (!questionBank) {
    return NextResponse.json(
      { message: "Question bank not found" },
      { status: 404 }
    );
  }

  // Save data to database
  await db.insert(contributionTable).values({
    contributionType: "create",
    questionBankId: data.questionBankId,
    question: data.question,
    type: data.type as "MCQ" | "MSQ" | "NUMERIC",
    options: data.options ?? null,
    correctAnswer: data.correctAnswer,
    contributorId: auth.user.id,
    status: "pending",
    prevQuestionId: "gr7f8jjwyidmz1q9x17x7vy4",
  });

  return NextResponse.json({ message: "success" });
};
