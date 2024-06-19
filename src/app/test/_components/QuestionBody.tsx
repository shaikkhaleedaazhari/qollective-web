import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { QuizQuestion } from "@/lib/types";
import { Question } from "@/lib/validation";
import React from "react";

type QuestionBodyProps = {
  question: QuizQuestion;
  currentIndex: number;
  currentAnswer: string;
  setAnswer: (val: string) => void;
  loading: boolean;
};

const QuestionBody = ({
  question,
  currentIndex,
  currentAnswer,
  setAnswer,
  loading,
}: QuestionBodyProps) => {
  return (
    <div className="h-full px-12 py-8 space-y-4">
      <h1 className="font-medium text-3xl">Question No. {currentIndex + 1}</h1>
      <h3 className="text-xl">{question.question}</h3>
      {question.options?.map((option, index) => (
        <Card key={index}>
          <CardContent className="flex items-center space-x-2 p-4">
            <Checkbox
              disabled={loading}
              checked={currentAnswer === index.toString()}
              onCheckedChange={() => setAnswer(index.toString())}
            />
            <Label htmlFor={option}>{option}</Label>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default QuestionBody;
