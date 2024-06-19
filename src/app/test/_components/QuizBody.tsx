"use client";
import { QuizQuestion } from "@/lib/types";
import QuestionBody from "./QuestionBody";
import QuestionPalette from "./QuestionPalette";
import { Button } from "@/components/ui/button";
import useQuiz from "@/hooks/useQuiz";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";

type QuizBodyProps = {
  questions: QuizQuestion[];
  quizId: string;
};

const QuizBody = ({ questions, quizId }: QuizBodyProps) => {
  const router = useRouter();
  const {
    currentQuizIndex,
    hasNext,
    hasPrev,
    nextQuiz,
    prevQuiz,
    quiz,
    markAndNext,
    clearResponse,
    currentAnswer,
    setCurrentAnswer,
    saveAndNext,
    goToIndex,
  } = useQuiz(questions);

  const mutation = useMutation({
    mutationFn: async () => {
      return await axios.post(`/api/test/${quizId}`, {
        data: quiz,
      });
    },
    onSuccess: () => {
      console.log("success");
      router.push(`/result/${quizId}`);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  console.log(currentQuizIndex);
  return (
    <>
      <div className="flex-grow grid grid-cols-[65%_35%]">
        <div className="">
          <QuestionBody
            currentAnswer={currentAnswer}
            setAnswer={(val) => setCurrentAnswer(val)}
            currentIndex={currentQuizIndex}
            question={questions[currentQuizIndex]}
            loading={mutation.isPending}
          />
        </div>
        <div className="">
          <QuestionPalette
            goToIndex={goToIndex}
            loading={mutation.isPending}
            currentIndex={currentQuizIndex}
            questions={quiz}
          />
        </div>
      </div>
      <div className="bg-gray-100 grid grid-cols-[65%_35%] py-4">
        <div className="flex justify-around items-center px-6">
          <Button
            onClick={saveAndNext}
            disabled={currentAnswer === "" || mutation.isPending}
            className="bg-green-600 hover:bg-green-800"
          >
            Save and Next
          </Button>
          <Button
            onClick={markAndNext}
            disabled={
              quiz[currentQuizIndex].answer !== "" || mutation.isPending
            }
            className="bg-purple-600 hover:bg-purple-800"
          >
            Mark for Review and Next
          </Button>
          <Button
            disabled={mutation.isPending}
            onClick={clearResponse}
            variant="destructive"
          >
            Clear Response
          </Button>
        </div>
        <div className="space-x-2.5 flex items-center justify-between px-6">
          <div className="space-x-2">
            <Button
              disabled={!hasPrev || mutation.isPending}
              onClick={prevQuiz}
            >
              Previous
            </Button>
            <Button
              disabled={!hasNext || mutation.isPending}
              onClick={nextQuiz}
            >
              Next
            </Button>
          </div>
          <Button
            disabled={mutation.isPending}
            onClick={() => mutation.mutate()}
            className="bg-blue-600 hover:bg-blue-800"
          >
            Submit
          </Button>
        </div>
      </div>
    </>
  );
};

export default QuizBody;
