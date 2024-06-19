import { Question } from "./validation";

export type QuizQuestion = Question & {
  markedForReview: boolean;
  attended: boolean;
  answer: string;
};
