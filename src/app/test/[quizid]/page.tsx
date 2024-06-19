import React from "react";
import Header from "@/components/Header";
import { db } from "@/lib/db";
import { and, eq } from "drizzle-orm";
import { quizTable } from "@/lib/schema/questions";
import { notFound } from "next/navigation";
import QuizBody from "../_components/QuizBody";

type QuizPageProps = {
  params: {
    quizid: string;
  };
};
const QuizPage = async ({ params }: QuizPageProps) => {
  const quiz = await db.query.quizTable.findFirst({
    where: and(
      eq(quizTable.id, params.quizid),
      eq(quizTable.status, "ongoing")
    ),
  });

  if (!quiz) {
    return notFound();
  }
  return (
    <main className="h-screen flex flex-col">
      <Header />
      <QuizBody quizId={params.quizid} questions={quiz.data} />
    </main>
  );
};

export default QuizPage;
