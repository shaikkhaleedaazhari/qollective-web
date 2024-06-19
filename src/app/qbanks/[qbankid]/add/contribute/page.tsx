import React from "react";
import { questionBankTable } from "@/lib/schema/questions";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import AddQuestionForm from "../_components/AddQuestionForm";

type AddContributePageProps = {
  params: {
    qbankid: string;
  };
};

const AddContributePage = async ({ params }: AddContributePageProps) => {
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
      <AddQuestionForm isContribute questionBankId={params.qbankid} />
    </div>
  );
};

export default AddContributePage;
