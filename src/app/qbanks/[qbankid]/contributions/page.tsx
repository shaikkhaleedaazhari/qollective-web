import { db } from "@/lib/db";
import { contributionTable, questionBankTable } from "@/lib/schema/questions";
import { and, eq } from "drizzle-orm";
import React from "react";
import ContributionCard from "./_components/ContributionCard";
import { getServerUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type ContributionsPageProps = {
  params: {
    qbankid: string;
  };
};

const ContributionsPage = async ({ params }: ContributionsPageProps) => {
  const auth = await getServerUser();
  if (!auth?.user) {
    return redirect("/login");
  }

  const questionBank = await db.query.questionBankTable.findFirst({
    where: eq(questionBankTable.id, params.qbankid),
    columns: {
      id: true,
      userId: true,
    },
  });

  if (!questionBank || questionBank.userId !== auth.user.id) {
    return redirect("/qbanks");
  }
  const contributions = await db.query.contributionTable.findMany({
    where: and(
      eq(contributionTable.questionBankId, params.qbankid),
      eq(contributionTable.status, "pending")
    ),
    with: {
      contributor: true,
      prevQuestion: true,
    },
  });

  return (
    <div className="space-y-2 py-4">
      {contributions.map((contribution) => (
        <ContributionCard contribution={contribution} key={contribution.id} />
      ))}
      {contributions.length === 0 && (
        <div className="">
          <p className="text-center mt-8 text-xl uppercase">
            No contributions yet
          </p>
          <Button className="mx-auto block w-fit mt-4" asChild>
            <Link href={`/qbanks/${questionBank.id}`}>Go back to Qbank</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default ContributionsPage;
