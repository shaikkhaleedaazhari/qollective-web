import React from "react";
import { questionBankTable, questionTable } from "@/lib/schema/questions";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import EditQuestionForm from "../_components/EditQuestionForm";

type AddQuestionPageProps = {
  params: {
    qbankid: string;
    questionid: string;
  };
};

const AddQuestionPage = async ({ params }: AddQuestionPageProps) => {
  const questionbank = await db.query.questionBankTable.findFirst({
    where: eq(questionBankTable.id, params.qbankid),
    columns: {
      id: true,
    },
  });

  const question = await db.query.questionTable.findFirst({
    where: eq(questionTable.id, params.questionid),
  });

  if (!questionbank || !question) {
    return notFound();
  }
  return (
    <div>
      <EditQuestionForm
        prevQuestion={question}
        questionBankId={params.qbankid}
      />
    </div>
  );
};

export default AddQuestionPage;
