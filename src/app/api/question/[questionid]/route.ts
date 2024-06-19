import { getServerUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { questionTable } from "@/lib/schema/questions";
import { isDifferent } from "@/lib/utils";
import { commonQuestionSchema } from "@/lib/validation";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (
  req: NextRequest,
  {
    params,
  }: {
    params: {
      questionid: string;
    };
  }
) => {
  const auth = await getServerUser();

  if (!auth?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const question = await db.query.questionTable.findFirst({
    where: eq(questionTable.id, params.questionid),
    columns: {
      id: true,
      questionBankId: true,
    },
  });

  if (!question) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const res = await db
    .delete(questionTable)
    .where(eq(questionTable.id, params.questionid));

  if (res[0].affectedRows === 0) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }

  revalidatePath(`/api/qbank/${question.questionBankId}`);

  return NextResponse.json({ message: "deleted" });
};

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
  const reqBody = await req.json();
  const auth = await getServerUser();
  if (!auth?.user) {
    return NextResponse.json({ message: "unauthorized" }, { status: 401 });
  }

  const prevQuestion = await db.query.questionTable.findFirst({
    where: eq(questionTable.id, params.questionid),
    with: {
      questionBank: true,
    },
  });

  if (!prevQuestion) {
    return NextResponse.json(
      { message: "question not found" },
      { status: 404 }
    );
  }

  if (prevQuestion.questionBank.userId !== auth.user.id) {
    return NextResponse.json({ message: "unauthorized" }, { status: 401 });
  }

  const parsedBody = await commonQuestionSchema.safeParseAsync(reqBody);

  if (!parsedBody.success) {
    return NextResponse.json({ message: "invalid data" }, { status: 400 });
  }

  if (!isDifferent(parsedBody.data, prevQuestion)) {
    return NextResponse.json(
      { message: "no changes in question" },
      { status: 400 }
    );
  }

  const res = await db
    .update(questionTable)
    .set({
      correctAnswer: parsedBody.data.correctAnswer,
      question: parsedBody.data.question,
      options: parsedBody.data.options,
    })
    .where(eq(questionTable.id, params.questionid));

  if (res[0].affectedRows === 0) {
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }

  revalidatePath(`/qbank/${prevQuestion.questionBank.id}`, "page");

  return NextResponse.json({ message: "success" });
};
