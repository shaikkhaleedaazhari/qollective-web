import { ScrollArea } from '@/components/ui/scroll-area'
import React from 'react'
import QuestionBankCard from './_components/QuestionBankCard'
import SearchBar from './_components/SearchBar'
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { questionBankTable } from "@/lib/schema/questions";

type QuestionBankPageProps = {
  searchParams: {
    exam?: string;
    search?: string;
  };
};

const QuestionBankPage = async ({ searchParams }: QuestionBankPageProps) => {
  const qbanks = await db.query.questionBankTable.findMany({
    with: {
      questions: true,
      userId: true,
      examType: true,
    },
  });

  const filteredQbanks = qbanks.filter((qbank) => {
    if (searchParams.exam) {
      return qbank.examType.examName === searchParams.exam;
    }

    if (searchParams.search) {
      return qbank.name
        .toLowerCase()
        .includes(searchParams.search.toLowerCase());
    }
    return true;
  });

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

export default QuestionBankPage
