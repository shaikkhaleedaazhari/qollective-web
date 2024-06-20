import { getServerUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { quizTable } from "@/lib/schema/questions";
import { QuizQuestion } from "@/lib/types";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  req: NextRequest,
  { params }: { params: { quizid: string } }
) => {
  const auth = await getServerUser();
  if (!auth?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const quiz = await db.query.quizTable.findFirst({
    where: and(
      eq(quizTable.id, params.quizid),
      eq(quizTable.status, "ongoing")
    ),
  });

  if (!quiz) {
    return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
  }

  if (quiz.userId !== auth.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();

  let mark = 0;
  data.data.forEach((question: QuizQuestion) => {
    if (question.answer !== "") {
      if (question.answer === question.correctAnswer[0]) {
        mark += 4;
      } else {
        mark -= 1;
      }
    }
  });

  console.log(mark);

  await db.update(quizTable).set({
    data: data.data,
    status: "finished",
    mark: mark,
  });

  return NextResponse.json({
    message: "Quiz finished",
    mark: `${mark}/${quiz.data.length * 4}`,
  });
};
