import { getServerUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { questionBankTable, quizTable } from "@/lib/schema/questions";
import { QuizQuestion } from "@/lib/types";
import { desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createTestSchema = z.object({
  questionBankId: z.string(),
});

export const POST = async (req: NextRequest) => {
  const auth = await getServerUser();

  if (!auth?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const reqBody = await req.json();

  const parsedBody = await createTestSchema.safeParseAsync(reqBody);

  if (!parsedBody.success) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  const questionBank = await db.query.questionBankTable.findFirst({
    where: eq(questionBankTable.id, parsedBody.data.questionBankId),
    with: {
      questions: true,
    },
  });

  if (!questionBank) {
    return NextResponse.json(
      { error: "Question bank not found" },
      { status: 404 }
    );
  }

  if (questionBank.questions.length === 0) {
    return NextResponse.json(
      { error: "No questions found in the question bank" },
      { status: 404 }
    );
  }

  const modifiedQuestionData: QuizQuestion[] = questionBank.questions.map(
    (question) => {
      return {
        id: question.id,
        question: question.question,
        options: question.options,
        correctAnswer: question.correctAnswer,
        answer: "",
        attended: false,
        markedForReview: false,
        createdAt: question.createdAt,
        updatedAt: question.updatedAt,
        questionBankId: questionBank.id,
        type: question.type,
      };
    }
  );

  await db.insert(quizTable).values({
    data: modifiedQuestionData,
    userId: auth.user.id,
    minutes: modifiedQuestionData.length,
    status: "ongoing",
  });

  const quiz = await db
    .select({
      id: quizTable.id,
    })
    .from(quizTable)
    .where(eq(quizTable.userId, auth.user.id))
    .orderBy(desc(quizTable.createdAt))
    .limit(1);

  if (quiz.length === 0) {
    return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, quizid: quiz[0].id });
};
