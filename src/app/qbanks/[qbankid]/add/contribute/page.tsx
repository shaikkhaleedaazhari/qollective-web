import React from "react";
import { questionBankTable } from "@/lib/schema/questions";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import AddQuestionForm from "../_components/AddQuestionForm";
import { getServerUser } from "@/lib/auth";

type AddContributePageProps = {
  params: {
    qbankid: string;
  };
};

const AddContributePage = async ({ params }: AddContributePageProps) => {
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

  if (!questionbank || questionbank.userId.id === auth.user.id) {
    return notFound();
  }
  return (
    <div>
      <AddQuestionForm isContribute questionBankId={params.qbankid} />
    </div>
  );
};

export default AddContributePage;
