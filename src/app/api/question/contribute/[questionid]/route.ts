import { getServerUser } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  contributionTable,
  questionBankTable,
  questionTable,
} from "@/lib/schema/questions";
import { commonQuestionSchema } from "@/lib/validation";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const PATCH = async (
  req: NextRequest,
  {
    params,
  }: {
    params: {
      questionid: string;
    };
  }
) => {
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

  const question = await db.query.questionTable.findFirst({
    where: eq(questionTable.id, params.questionid),
    columns: {
      id: true,
      questionBankId: true,
      type: true,
    },
  });

  if (!question) {
    return NextResponse.json(
      { message: "Question not found" },
      { status: 404 }
    );
  }

  if (question.questionBankId !== data.questionBankId) {
    return NextResponse.json(
      { message: "Question bank mismatch" },
      { status: 400 }
    );
  }

  // Save data to database

  await db.insert(contributionTable).values({
    contributionType: "edit",
    questionBankId: question.questionBankId,
    question: data.question,
    type: question.type,
    options: data.options ?? null,
    correctAnswer: data.correctAnswer,
    contributorId: auth.user.id,
    status: "pending",
    prevQuestionId: question.id,
  });

  return NextResponse.json({ message: "success" });
};
