import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { questionBankTable } from "@/lib/schema/questions";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import QuestionList from "./_components/QuestionList";
import TakeTestButton from "./_components/TakeTestButton";
import { getServerUser } from "@/lib/auth";
import { cn } from "@/lib/utils";

type QuestionBankPageProps = {
  params: {
    qbankid: string;
  };
};

const QuestionBankPage = async ({ params }: QuestionBankPageProps) => {
  // fetch question bank by id
  const auth = await getServerUser();
  const questionBank = await db.query.questionBankTable.findFirst({
    where: eq(questionBankTable.id, params.qbankid),
    with: {
      examType: true,
      userId: true,
      questions: true,
    },
  });

  if (questionBank === undefined) {
    return notFound();
  }

  let userType: "anon" | "author" | "user" = "anon";

  if (auth?.user && questionBank.userId.id === auth.user.id) {
    userType = "author";
  } else if (auth?.user) {
    userType = "user";
  }

  return (
    <div>
      <div className="text-center space-y-3 py-4 px-4">
        <h1 className="font-semibold text-2xl">{questionBank.name}</h1>
        <div className="flex gap-1 mx-auto w-fit">
          <Badge>{questionBank.examType.examName}</Badge>
          <Badge>{questionBank.subject}</Badge>
        </div>
        <p className="text-sm">by @{questionBank.userId.email}</p>
        <div
          className={cn(
            "grid grid-cols-2 max-w-[500px] mx-auto gap-2.5",
            userType === "author" && "grid-cols-3"
          )}
        >
          {userType === "author" && (
            <>
              <Button asChild>
                <Link href={`/qbanks/${questionBank.id}/add`}>
                  Add Question
                </Link>
              </Button>
              <Button asChild>
                <Link href={`/qbanks/${questionBank.id}/contributions`}>
                  View Contributions
                </Link>
              </Button>
            </>
          )}
          {userType === "user" && (
            <Button asChild>
              <Link href={`/qbanks/${questionBank.id}/add/contribute`}>
                Contribute Question
              </Link>
            </Button>
          )}
          {userType !== "anon" && (
            <TakeTestButton questionBankId={questionBank.id} />
          )}
        </div>
      </div>
      <div className="py-4">
        <QuestionList userType={userType} questions={questionBank.questions} />
        {questionBank.questions.length === 0 && (
          <div className="text-center text-xl text-gray-500 mt-8">
            No questions found, Add a Question
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionBankPage;
