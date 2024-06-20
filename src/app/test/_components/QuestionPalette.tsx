"use client";

import { useMeasure } from "@uidotdev/usehooks";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { QuizQuestion } from "@/lib/types";

type QuestionPaletteProps = {
  questions: QuizQuestion[];
  currentIndex: number;
  loading: boolean;
  goToIndex: (index: number) => void;
  time: {
    hours: number;
    minutes: number;
    seconds: number;
  };
};

const QuestionPalette = ({
  questions,
  currentIndex,
  loading,
  goToIndex,
  time,
}: QuestionPaletteProps) => {
  const [ref, { width, height }] = useMeasure();
  return (
    <div className="h-full border-l border-gray-400 p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-xl">Question Palette</h3>
        <p className="mr-4 text-2xl tracking-widest">
          {String(time.hours).padStart(2, "0")}:
          {String(time.minutes).padStart(2, "0")}:
          {String(time.seconds).padStart(2, "0")}
        </p>
      </div>
      <div className="flex-1  overflow-y-auto">
        <div
          ref={ref}
          className={cn(
            "grid gap-2.5 min-h-0 h-0 py-1.5 px-1.5",
            getColumns(width ?? 0)
          )}
        >
          {questions.map((_, i) => (
            <Button
              disabled={loading}
              onClick={() => {
                if (i !== currentIndex) goToIndex(i);
              }}
              key={i}
              className={cn(
                "aspect-square flex justify-center items-center w-full h-auto",
                questions[i].markedForReview &&
                  "bg-violet-600 hover:bg-violet-800 text-white",
                questions[i].attended &&
                  questions[i].answer === "" &&
                  !questions[i].markedForReview &&
                  "bg-red-600 hover:bg-red-800 text-white",
                questions[i].attended &&
                  questions[i].answer !== "" &&
                  "bg-green-600 hover:bg-green-800",
                i === currentIndex && "opacity-50 outline outline-black"
              )}
              variant="outline"
            >
              {i + 1}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

function getColumns(width: number) {
  if (width <= 200) return "grid-cols-3";
  if (width <= 300) return "grid-cols-4";
  if (width <= 400) return "grid-cols-5";
  if (width <= 500) return "grid-cols-6";
  else return "grid-cols-7";
}

export default QuestionPalette;
