"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { questionTable } from "@/lib/schema/questions";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

type Question = typeof questionTable.$inferSelect;

type QuestionListProps = {
  questions: Question[];
};

const QuestionList = ({ questions }: QuestionListProps) => {
  return (
    <div className="mt-4">
      <Accordion type="single" collapsible className="w-full">
        {questions.map((question, i) => (
          <AccordionItem key={question.id} value={question.id}>
            <AccordionTrigger className="text-left">
              {i + 1}. {question.question}
            </AccordionTrigger>
            <AccordionContent className="text-left">
              <Question question={question} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

type QuestionProps = {
  question: Question;
};

const Question = ({ question }: QuestionProps) => {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const deleteMutation = useMutation({
    mutationFn: () => {
      return axios.delete(`/api/question/${question.id}`);
    },
    onSuccess: () => {
      console.log("deleted");
      router.refresh();
    },
  });
  return (
    <div className="space-y-6">
      <p>{question.question}</p>
      <div className="grid grid-cols-2 gap-2.5">
        {question.options?.map((option, index) => (
          <p key={index + question.id}>
            {index + 1}) {option}
          </p>
        ))}
      </div>

      <Button
        className="w-full"
        onClick={() => setShow((prev) => !prev)}
        variant="outline"
      >
        {show
          ? `option ${Number(question.correctAnswer[0]) + 1}`
          : "Show Answer"}
      </Button>
      <div className="grid grid-cols-2 gap-2.5">
        <Button
          onClick={() => {
            deleteMutation.mutate();
          }}
          variant="destructive"
          disabled={deleteMutation.isPending}
        >
          Delete
        </Button>
        <Button asChild className="">
          <Link href={`/qbanks/${question.questionBankId}/edit/${question.id}`}>
            Edit
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default QuestionList;
