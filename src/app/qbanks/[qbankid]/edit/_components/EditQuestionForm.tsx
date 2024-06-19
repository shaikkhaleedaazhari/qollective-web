"use client";

import FormErrorMessage from "@/components/FormErrorMessage";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { isDifferent } from "@/lib/utils";
import { Question, commonQuestionSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Loader } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

type EditQuestionFormType = {
  questionBankId: string;
  prevQuestion: Question;
  isContribute?: boolean;
};

type CommonQuestionSchemaType = z.infer<typeof commonQuestionSchema>;

const EditQuestionForm = ({
  questionBankId,
  prevQuestion,
  isContribute,
}: EditQuestionFormType) => {
  const router = useRouter();
  const form = useForm<CommonQuestionSchemaType>({
    resolver: zodResolver(commonQuestionSchema),
    defaultValues: {
      question: prevQuestion.question,
      questionBankId: prevQuestion.questionBankId,
      type: prevQuestion.type,
      correctAnswer: prevQuestion.correctAnswer,
      options: prevQuestion.options as (string | undefined)[] | undefined,
    },
  });
  const url = isContribute
    ? `/api/question/contribute/${prevQuestion.id}`
    : `/api/question/${prevQuestion.id}`;

  const mutation = useMutation({
    mutationFn: async (data: CommonQuestionSchemaType) => {
      return (await axios.patch(url, data)).data;
    },

    onSuccess: () => {
      router.refresh();
      if (isContribute) {
        router.push(`/qbanks/${questionBankId}`);
      } else {
        router.push(`/qbanks/${questionBankId}`);
      }
    },
  });

  const questionType = form.watch("type");

  const correctAnswer = form.watch("correctAnswer");

  const handleMcqCheck = (index: number) => {
    form.setValue("correctAnswer", [index.toString()]);
    form.trigger("correctAnswer");
  };

  const handleMsqCheck = (index: number) => {
    const currentCorrectAnswer = form.watch("correctAnswer");
    const newCorrectAnswer = currentCorrectAnswer.includes(index.toString())
      ? currentCorrectAnswer.filter((item) => item !== index.toString())
      : [...currentCorrectAnswer, index.toString()];

    form.setValue("correctAnswer", newCorrectAnswer);
    form.trigger("correctAnswer");
  };

  console.log(form.formState.errors);

  const handleSubmit = form.handleSubmit(async (data) => {
    const different = isDifferent(data, prevQuestion);
    if (!different) {
      form.setError("root", {
        message: "Please change the content to submit the edit",
      });
      return;
    }

    await mutation.mutateAsync(data);
  });
  return (
    <form className="space-y-4 px-4 py-8" onSubmit={handleSubmit}>
      {form.formState.errors.root && (
        <div className="bg-red-200 border border-red-400 text-center w-full py-4">
          <p className="text-red-500">{form.formState.errors.root.message}</p>
        </div>
      )}
      <div className="space-y-2">
        <Label>Question</Label>
        <Textarea {...form.register("question")} />
        <FormErrorMessage message={form.formState.errors.question?.message} />
      </div>

      <div>
        {questionType === "MCQ" && (
          <div className="space-y-2">
            <Label>Options</Label>
            <div className="space-y-2">
              {["Option 1", "Option 2", "Option 3", "Option 4"].map(
                (option, index) => (
                  <div key={index}>
                    <div className="flex gap-2.5 items-center">
                      <Checkbox
                        checked={correctAnswer?.includes(index.toString())}
                        onCheckedChange={() => handleMcqCheck(index)}
                      />
                      <Input
                        {...form.register(`options.${index}`)}
                        placeholder={option}
                      />
                    </div>
                    <FormErrorMessage
                      message={form.formState.errors.options?.[index]?.message}
                    />
                  </div>
                )
              )}
            </div>
          </div>
        )}
        {questionType === "MSQ" && (
          <div className="space-y-2">
            <Label>Options</Label>
            <div className="space-y-2">
              {["Option 1", "Option 2", "Option 3", "Option 4"].map(
                (option, index) => (
                  <div key={index}>
                    <div className="flex gap-2.5 items-center">
                      <Checkbox
                        checked={correctAnswer?.includes(index.toString())}
                        onCheckedChange={() => handleMsqCheck(index)}
                      />
                      <Input
                        {...form.register(`options.${index}`, {
                          shouldUnregister: true,
                        })}
                        placeholder={option}
                      />
                    </div>
                    <FormErrorMessage
                      message={form.formState.errors.options?.[index]?.message}
                    />
                  </div>
                )
              )}
            </div>
            <FormErrorMessage
              message={form.formState.errors.options?.message}
            />
          </div>
        )}
      </div>
      <div>
        {questionType === "NUMERIC" && (
          <div className="space-y-2">
            <Label>Correct Answer</Label>
            <div className="space-y-2">
              <Input
                {...form.register(`correctAnswer.0`, {
                  shouldUnregister: true,
                })}
                placeholder="Correct Answer"
              />
            </div>
          </div>
        )}
        <FormErrorMessage
          message={form.formState.errors.correctAnswer?.[0]?.message}
        />
        <FormErrorMessage
          message={form.formState.errors.correctAnswer?.message}
        />
      </div>
      <div className="flex justify-between">
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? <Loader className="" /> : "Submit"}
        </Button>
        <Button variant="outline" asChild>
          <Link href={`/qbanks/${questionBankId}`}>Cancel</Link>
        </Button>
      </div>
    </form>
  );
};

export default EditQuestionForm;
