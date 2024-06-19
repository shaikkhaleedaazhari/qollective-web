import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Question, commonQuestionSchema } from "./validation";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function isDifferent(
  newQuestion: z.infer<typeof commonQuestionSchema>,
  oldQuestion: Question
) {
  let isDifferent = false;
  if (newQuestion.question !== oldQuestion.question) {
    isDifferent = true;
  }

  newQuestion.options?.forEach((option) => {
    if (!oldQuestion.options?.includes(option)) {
      isDifferent = true;
    }
  });

  newQuestion.correctAnswer.forEach((answer) => {
    if (!oldQuestion.correctAnswer.includes(answer)) {
      isDifferent = true;
    }
  });

  return isDifferent;
}