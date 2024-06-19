import { QuizQuestion } from "@/lib/types";
import { useState } from "react";

const useQuiz = (loadedQuiz: QuizQuestion[]) => {
  const [quiz, setQuiz] = useState(loadedQuiz);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);

  const hasNext = currentQuizIndex + 1 < quiz.length;
  const hasPrev = currentQuizIndex > 0;

  const prevQuiz = () => {
    if (currentQuizIndex > 0) {
      if (!quiz[currentQuizIndex].attended) {
        quiz[currentQuizIndex].attended = true;
        setQuiz([...quiz]);
      }
      setCurrentQuizIndex(currentQuizIndex - 1);
      setCurrentAnswer(quiz[currentQuizIndex - 1].answer);
    }
  };

  const nextQuiz = () => {
    if (currentQuizIndex + 1 < quiz.length) {
      if (!quiz[currentQuizIndex].attended) {
        quiz[currentQuizIndex].attended = true;
        setQuiz([...quiz]);
      }
      setCurrentQuizIndex(currentQuizIndex + 1);
      setCurrentAnswer(quiz[currentQuizIndex + 1].answer);
    }
  };

  const markAndNext = () => {
    quiz[currentQuizIndex].markedForReview = true;
    setQuiz([...quiz]);
    if (hasNext) {
      nextQuiz();
    }
  };

  const clearResponse = () => {
    quiz[currentQuizIndex].answer = "";
    quiz[currentQuizIndex].attended = true;
    quiz[currentQuizIndex].markedForReview = false;
    setCurrentAnswer("");
    setQuiz([...quiz]);
  };

  const saveAndNext = () => {
    if (currentAnswer !== "") {
      quiz[currentQuizIndex].answer = currentAnswer;
      quiz[currentQuizIndex].attended = true;
      setQuiz([...quiz]);
      if (hasNext) {
        nextQuiz();
      }
    }
  };

  const goToIndex = (index: number) => {
    if (index >= 0 && index < quiz.length) {
      quiz[currentQuizIndex].attended = true;
      setCurrentQuizIndex(index);
      setCurrentAnswer(quiz[index].answer);
      setQuiz([...quiz]);
    }
  };

  return {
    currentQuizIndex,
    hasNext,
    hasPrev,
    prevQuiz,
    nextQuiz,
    quiz,
    markAndNext,
    clearResponse,
    currentAnswer,
    setCurrentAnswer,
    saveAndNext,
    goToIndex,
  };
};

export default useQuiz;
