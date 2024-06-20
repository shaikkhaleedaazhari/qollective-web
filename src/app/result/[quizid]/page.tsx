import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { db } from "@/lib/db";
import { quizTable } from "@/lib/schema/questions";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

type ResultPageProps = {
  params: {
    quizid: string;
  };
};

const ResultPage = async ({ params }: ResultPageProps) => {
  const quiz = await db.query.quizTable.findFirst({
    where: eq(quizTable.id, params.quizid),
  });

  if (!quiz || quiz.status !== "finished") {
    return notFound();
  }

  let wrong = 0;
  let unattended = 0;
  let correct = 0;
  quiz.data.forEach((question) => {
    if (question.answer === "") {
      unattended++;
    } else if (question.answer !== question.correctAnswer[0]) {
      wrong++;
    } else {
      correct++;
    }
  });

  let totalMark = quiz.data.length * 4;
  return (
    <main className="h-screen flex flex-col">
      <Header />
      <Card className="w-full max-w-[500px] mt-16 mx-auto">
        <CardHeader className="text-center">Your Result is:</CardHeader>
        <CardContent className="">
          <p className="text-center font-semibold">
            <span className="text-2xl"> {quiz.mark}</span> / {totalMark}
          </p>
          <div className="w-fit mx-auto py-4 space-y-2">
            {correct > 0 && (
              <p className="text-green-800">
                Correct: {correct} out of {quiz.data.length}
              </p>
            )}
            {wrong > 0 && (
              <p className="text-red-800">
                Wrong: {wrong} out of {quiz.data.length}
              </p>
            )}
            {unattended > 0 && (
              <p className="text-yellow-800">
                Unattended: {unattended} out of {quiz.data.length}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button className="mx-auto" asChild>
            <Link href="/qbanks">Go to Questions</Link>
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
};

export default ResultPage;
