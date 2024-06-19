import React from "react";
import { questionBankTable, questionTable } from "@/lib/schema/questions";
import AddQuestionForm from "./_components/AddQuestionForm";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

type AddQuestionPageProps = {
  params: {
    qbankid: string;
  };
};

const AddQuestionPage = async ({ params }: AddQuestionPageProps) => {
  const questionbank = await db.query.questionBankTable.findFirst({
    where: eq(questionBankTable.id, params.qbankid),
    columns: {
      id: true,
    },
  });

  if (!questionbank) {
    return notFound();
  }
  return (
    <div>
      <AddQuestionForm questionBankId={params.qbankid} />
    </div>
  );
};

export default AddQuestionPage;
