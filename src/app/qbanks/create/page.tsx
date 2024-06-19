import { db } from "@/lib/db";
import { examTypeTable } from "@/lib/schema/questions";
import React from "react";
import QBankCreateForm from "./_components/QBankCreateForm";

const CreateQBankPage = async () => {
  const examTypes = await db.select().from(examTypeTable);

  return (
    <div>
      <QBankCreateForm examTypes={examTypes} />
    </div>
  );
};

export default CreateQBankPage;
