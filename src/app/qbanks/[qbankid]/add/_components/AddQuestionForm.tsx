"use client";

import FormErrorMessage from "@/components/FormErrorMessage";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { commonQuestionSchema, questionTypes } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Loader } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

type AddQuestionFormType = {
  questionBankId: string;
  isContribute?: boolean;
};

type CommonQuestionSchemaType = z.infer<typeof commonQuestionSchema>;

const AddQuestionForm = ({
  questionBankId,
  isContribute,
}: AddQuestionFormType) => {
  const router = useRouter();
  const form = useForm<CommonQuestionSchemaType>({
    resolver: zodResolver(commonQuestionSchema),
    defaultValues: {
      question: "",
      questionBankId: questionBankId,
      type: "MCQ",
    },
  });

  const url = isContribute ? "/api/question/contribute" : "/api/question";

  const mutation = useMutation({
    mutationFn: async (data: CommonQuestionSchemaType) => {
      return (await axios.post(url, data)).data;
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
    await mutation.mutateAsync(data);
  });
  return (
    <form className="space-y-4 px-4 py-8" onSubmit={handleSubmit}>
      <h1 className="font-semibold text-3xl">
        {isContribute ? "Contribute Question" : "Add Question"}
      </h1>
      <div className="space-y-2">
        <Label>Question</Label>
        <Textarea {...form.register("question")} />
        <FormErrorMessage message={form.formState.errors.question?.message} />
      </div>
      <div className="space-y-2">
        <Label>Question Type</Label>
        <Select
          value={questionType}
          onValueChange={(val) => {
            console.log(val);
            form.setValue("type", val);
            form.trigger("type");
            form.setValue("correctAnswer", []);
            form.setValue("options", []);
            form.trigger("correctAnswer");
            form.trigger("options");
          }}
        >
          <SelectTrigger className="max-w-[300px]">
            <SelectValue placeholder="Select question type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Question Type</SelectLabel>
              {questionTypes.map((questionType) => (
                <SelectItem key={questionType} value={questionType}>
                  {questionType}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <FormErrorMessage message={form.formState.errors.type?.message} />
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

export default AddQuestionForm;
