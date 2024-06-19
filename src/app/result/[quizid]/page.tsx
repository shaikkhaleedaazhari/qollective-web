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

  let totalMark = quiz.data.length * 4;
  return (
    <main className="h-screen flex flex-col">
      <Header />
      <Card className="w-full max-w-[500px] mt-16 mx-auto">
        <CardHeader className="text-center">Your Result is:</CardHeader>
        <CardContent>
          <p className="text-center font-semibold">
            <span className="text-xl"> {quiz.mark}</span> / {totalMark}
          </p>
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
