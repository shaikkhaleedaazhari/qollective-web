"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { userTable } from "@/lib/schema/auth";
import { contributionTable, questionTable } from "@/lib/schema/questions";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";

type ContributionCardProps = {
  contribution: typeof contributionTable.$inferSelect & {
    contributor: typeof userTable.$inferSelect;
    prevQuestion: typeof questionTable.$inferSelect;
  };
};

const ContributionCard = ({ contribution }: ContributionCardProps) => {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: async (accept: boolean) => {
      return await axios.post(
        `/api/question/contribute/accept/${contribution.id}`,
        {
          accept,
        }
      );
    },
    onSuccess: () => {
      router.refresh();
      console.log("accepted");
    },
  });
  return (
    <div>
      <Card>
        <CardContent className="py-3">
          <div className="flex justify-between">
            <p>contribution by: {contribution.contributor.email}</p>
            <div className="space-x-3">
              <Button
                disabled={mutation.isPending}
                onClick={() => mutation.mutate(true)}
              >
                Accept
              </Button>
              <Button
                variant="destructive"
                disabled={mutation.isPending}
                onClick={() => mutation.mutate(false)}
              >
                Reject
              </Button>
            </div>
          </div>
          <Badge>{contribution.contributionType}</Badge>

          {contribution.contributionType === "edit" && (
            <div>
              <h4 className="text-lg font-medium">Previous Question:</h4>
              <p>{contribution.prevQuestion.question}</p>
              <div className="grid grid-cols-2 gap-2.5">
                {contribution.prevQuestion.options?.map((option, index) => (
                  <p key={index + contribution.id}>
                    {index + 1}) {option}
                  </p>
                ))}
              </div>
              <p className="mt-2">
                Answer: option{" "}
                {Number(contribution.prevQuestion.correctAnswer) + 1}
              </p>
            </div>
          )}
          <div className="mt-4">
            <h4 className="text-lg font-medium">
              {contribution.contributionType === "create"
                ? "Question"
                : "Edited Question"}
              :
            </h4>
            <p>{contribution.question}</p>
            <div className="grid grid-cols-2 gap-2.5">
              {contribution.options?.map((option, index) => (
                <p key={index + contribution.id}>
                  {index + 1}) {option}
                </p>
              ))}
            </div>
            <p className="mt-2">
              Answer: option {contribution.correctAnswer[0]}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContributionCard;
