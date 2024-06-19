import React from "react";
import { questionBankTable, questionTable } from "@/lib/schema/questions";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import EditQuestionForm from "../../_components/EditQuestionForm";
import { getServerUser } from "@/lib/auth";

type AddQuestionPageProps = {
  params: {
    qbankid: string;
    questionid: string;
  };
};

const EditContributionPage = async ({ params }: AddQuestionPageProps) => {
  const auth = await getServerUser();
  if (!auth?.user) {
    return redirect("/login");
  }

  const questionbank = await db.query.questionBankTable.findFirst({
    where: eq(questionBankTable.id, params.qbankid),
    columns: {
      id: true,
    },
    with: {
      userId: true,
    },
  });

  const question = await db.query.questionTable.findFirst({
    where: eq(questionTable.id, params.questionid),
  });

  if (!questionbank || !question || questionbank.userId.id === auth.user.id) {
    return notFound();
  }
  return (
    <div>
      <EditQuestionForm
        prevQuestion={question}
        questionBankId={params.qbankid}
        isContribute
      />
    </div>
  );
};

export default EditContributionPage;
