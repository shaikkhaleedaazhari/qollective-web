import React from "react";
import QuestionBankCard from "./_components/QuestionBankCard";
import SearchBar from "./_components/SearchBar";
import { db } from "@/lib/db";

type QuestionBankPageProps = {
  searchParams: {
    exam?: string;
    search?: string;
  };
};

const QuestionBankPage = async ({ searchParams }: QuestionBankPageProps) => {
  // fetch qbanks from db
  const qbanks = await db.query.questionBankTable.findMany({
    with: {
      questions: true,
      userId: true,
      examType: true,
    },
  });

  // filter qbanks based on search params
  const filteredQbanks = qbanks.filter((qbank) => {
    let condition = true;
    if (searchParams.exam) {
      condition = qbank.examType.examName === searchParams.exam;
    }

    if (searchParams.search) {
      condition = qbank.name
        .toLowerCase()
        .includes(searchParams.search.toLowerCase());
    }
    return condition;
  });

  // fetch exam types from db
  const examTypes = await db.query.examTypeTable.findMany();

  return (
    <div className="mt-4">
      <SearchBar
        searchTerm={searchParams.search ?? ""}
        examType={searchParams.exam ?? "All"}
        examTypes={examTypes.map((examType) => examType.examName)}
      />
      <div className="mt-4 space-y-2.5">
        {filteredQbanks.map((qbank) => (
          <QuestionBankCard key={qbank.id} questionBank={qbank} />
        ))}
        {filteredQbanks.length === 0 && (
          <div className="text-center text-xl text-gray-500 mt-8">
            No question banks found
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionBankPage;
