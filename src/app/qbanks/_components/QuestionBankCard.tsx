"use client"

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { userTable } from "@/lib/schema/auth";
import {
  examTypeTable,
  questionBankTable,
  questionTable,
} from "@/lib/schema/questions";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type QuestionBankCardProps = {
  questionBank: typeof questionBankTable.$inferSelect & {
    questions: (typeof questionTable.$inferSelect)[];
    userId: typeof userTable.$inferSelect;
    examType: typeof examTypeTable.$inferSelect;
  };
};
const QuestionBankCard = ({ questionBank }: QuestionBankCardProps) => {
  return (
    <Link className="block" href={`/qbanks/${questionBank.id}`}>
      <Card className="hover:bg-gray-100 transition-colors">
        <CardContent className="py-8">
          <div className="flex gap-4">
            <div className="flex justify-between flex-grow">
              <div className="space-y-1">
                <div className="flex gap-2 items-center">
                  <h3 className="text-2xl font-semibold">
                    {questionBank.name}
                  </h3>
                  <Badge className="h-fit">
                    {questionBank.examType.examName}
                  </Badge>
                </div>
                <p className="text-sm text-gray-700">
                  {questionBank.subject} · {questionBank.questions.length}{" "}
                  Questions · created at:{" "}
                  {questionBank.createdAt?.toDateString()}
                </p>
                <p className="text-sm text-gray-700">
                  by @{questionBank.userId.email}
                </p>
              </div>
              {/* <div className="flex text-gray-500">
                <button
                  onClick={handleFavoriteClick}
                  className="gap-1.5 inline-flex justify-center items-center h-fit py-2 px-1.5"
                >
                  <Star />
                  <p>{questionBank.favorites}</p>
                </button>
              </div> */}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default QuestionBankCard
