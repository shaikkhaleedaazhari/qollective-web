"use client";

import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";
type TakeTestButtonProps = {
  questionBankId: string;
};
const TakeTestButton = ({ questionBankId }: TakeTestButtonProps) => {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: async () => {
      return (
        await axios.post("/api/test", {
          questionBankId,
        })
      ).data;
    },
    onSuccess: (data) => {
      console.log("success");
      router.push(`/test/${data.quizid}`);
    },
    onError: (error) => {
      console.error(error);
    },
  });
  return (
    <Button disabled={mutation.isPending} onClick={() => mutation.mutate()}>
      Take Test
    </Button>
  );
};

export default TakeTestButton;
