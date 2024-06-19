"use client";
import { Button } from "@/components/ui/button";
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
import { examTypeTable } from "@/lib/schema/questions";
import { createQBankSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

type ExamType = typeof examTypeTable.$inferSelect;

type QBankCreateFormType = {
  examTypes: ExamType[];
};

const QBankCreateForm = ({ examTypes }: QBankCreateFormType) => {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(createQBankSchema),
    defaultValues: {
      name: "",
      examType: "",
      subject: "",
      description: "",
    },
  });

  const mutation = useMutation({
    mutationKey: ["createQBank"],
    mutationFn: async (data: z.infer<typeof createQBankSchema>) => {
      return (await axios.post("/api/qbank", data)).data;
    },
    onSuccess(data) {
      console.log(data);
      form.reset();
      router.push(`/qbanks/${data.id}`);
    },
  });

  const examId = form.watch("examType");
  const subjects = examTypes.find((e) => e.id === examId)?.subjects;
  const subject = form.watch("subject");

  const handleSubmit = form.handleSubmit(async (data) => {
    console.log(data);
    await mutation.mutateAsync({
      ...data,
      description: data.description === "" ? undefined : data.description,
    });
  });
  return (
    <div>
      <form className="space-y-6 py-8 max-w-[300px]" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label>Question Bank Name</Label>
          <Input type="text" {...form.register("name")} />
          {form.formState.errors.name && (
            <p className="text-red-500 text-sm">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Exam Type</Label>
          <Select
            value={examId}
            onValueChange={(val) => {
              console.log(val);
              form.setValue("examType", val);
              form.trigger("examType");
              form.setValue("subject", "");
            }}
          >
            <SelectTrigger className="max-w-[300px]">
              <SelectValue placeholder="Select exam type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Exam Type</SelectLabel>
                {examTypes.map((examType) => (
                  <SelectItem key={examType.id} value={examType.id}>
                    {examType.examName}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {form.formState.errors.examType && (
            <p className="text-red-500 text-sm">
              {form.formState.errors.examType.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Subject</Label>
          <Select
            value={subject}
            onValueChange={(val) => {
              form.setValue("subject", val);
              form.trigger("subject");
            }}
            disabled={examId === ""}
          >
            <SelectTrigger className="max-w-[300px]">
              <SelectValue placeholder="Select subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Exam Type</SelectLabel>
                {subjects?.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {form.formState.errors.subject && (
            <p className="text-red-500 text-sm">
              {form.formState.errors.subject.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label>
            Description <span className="font-normal">(optional)</span>
          </Label>
          <Textarea {...form.register("description")} />
          {form.formState.errors.description && (
            <p className="text-red-500 text-sm">
              {form.formState.errors.description.message}
            </p>
          )}
        </div>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? <Loader className="" /> : "Submit"}
        </Button>
      </form>
    </div>
  );
};

export default QBankCreateForm;
