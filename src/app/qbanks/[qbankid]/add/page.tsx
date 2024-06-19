import React from "react";
import { questionBankTable, questionTable } from "@/lib/schema/questions";
import AddQuestionForm from "./_components/AddQuestionForm";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { getServerUser } from "@/lib/auth";

type AddQuestionPageProps = {
  params: {
    qbankid: string;
  };
};

const AddQuestionPage = async ({ params }: AddQuestionPageProps) => {
  const auth = await getServerUser();
  if (!auth?.user) {
    return redirect("/login");
  }

  // fetch question bank by id
  const questionbank = await db.query.questionBankTable.findFirst({
    where: eq(questionBankTable.id, params.qbankid),
    columns: {
      id: true,
    },
  });

  if (questionbank === undefined) {
    return notFound();
  }

  return (
    <div>
      <AddQuestionForm questionBankId={params.qbankid} />
    </div>
  );
};

export default AddQuestionPage;
