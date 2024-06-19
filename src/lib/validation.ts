import { z } from "zod";
import { questionTable } from "./schema/questions";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z
    .string({
      required_error: "password is required",
    })
    .min(8, {
      message: "Password must be 8 characters long",
    })
    .max(255, {
      message: "Password must be less than 255 characters",
    }),
});

export const registerSchema = z
  .object({
    email: z.string().email(),
    password: z
      .string({
        required_error: "password is required",
      })
      .min(8, {
        message: "Password must be 8 characters long",
      })
      .max(255, {
        message: "Password must be less than 255 characters",
      }),
    username: z
      .string()
      .min(3, {
        message: "Username must be 3 characters long",
      })
      .max(255, {
        message: "Username must be less than 255 characters",
      }),
    confirmPassword: z
      .string({
        required_error: "password is required",
      })
      .min(8, {
        message: "Password must be 8 characters long",
      })
      .max(255, {
        message: "Password must be less than 255 characters",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const createQBankSchema = z.object({
  name: z.string().trim().min(3, "Name must be at least 3 characters"),
  examType: z.string().trim().min(1, "Exam type is required"),
  subject: z.string().trim().min(1, "Subject is required"),
  description: z.string().trim().optional(),
});

export const questionSchema = z.object({
  question: z
    .string()
    .min(3, {
      message: "Question must be 3 characters long",
    })
    .max(255, {
      message: "Question must be less than 255 characters",
    }),
  options: z.array(
    z.object({
      option: z
        .string()
        .min(3, {
          message: "Option must be 3 characters long",
        })
        .max(255, {
          message: "Option must be less than 255 characters",
        }),
      isCorrect: z.boolean(),
    })
  ),
});

// add Question Schema

export type Question = typeof questionTable.$inferSelect;

type QuestionType = (typeof questionTable.type.enumValues)[number];

export const questionTypes: QuestionType[] = questionTable.type.enumValues;

const mcqSchema = z.object({
  correctAnswer: z
    .array(
      z
        .string()
        .trim()
        .min(1, "Correct answer must be atleast 1 character long")
    )
    .length(1, "There must be exactly 1 correct answer"),
  options: z
    .array(z.string().trim().min(1, "Option must be atleast 1 character long"))
    .min(4, "There must be atleast 4 options"),
});

const numericSchema = z.object({
  correctAnswer: z
    .array(
      z.number({
        required_error: "Correct answer must be a number",
      })
    )
    .length(1, "There must be exactly 1 correct answer"),
});

const msqSchema = z.object({
  correctAnswer: z
    .array(
      z
        .string()
        .trim()
        .min(1, "Correct answer must be atleast 1 character long")
    )
    .min(1, "There must be atleast 1 correct answer"),
  options: z
    .array(z.string().trim().min(1, "Option must be atleast 1 character long"))
    .min(4, "There must be atleast 4 options"),
});

export const commonQuestionSchema = z
  .object({
    question: z
      .string()
      .trim()
      .min(3, "Question must be atleast 3 characters long"),
    questionBankId: z.string().min(4, "Invalid question bank id"),
    type: z
      .string()
      .refine((val) => questionTypes.includes(val as QuestionType), {
        message: "Invalid question type",
      }),
    correctAnswer: z
      .array(
        z
          .string()
          .trim()
          .min(1, "Correct answer must be atleast 1 character long"),
        {
          required_error: "There must be a correct answer",
        }
      )
      .min(1, "There must be a correct answer"),
    options: z
      .array(
        z.string().trim().min(1, "Options must be atleast 1 character long")
      )
      .optional(),
  })
  .superRefine((val, ctx) => {
    if (val.type === "MCQ") {
      const parsedData = mcqSchema.safeParse({
        options: val.options,
        correctAnswer: val.correctAnswer,
      });

      if (!parsedData.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: parsedData.error.issues[0].message,
          path: [...parsedData.error.issues[0].path],
        });

        return false;
      }
    } else if (val.type === "MSQ") {
      const parsedData = msqSchema.safeParse({
        options: val.options,
        correctAnswer: val.correctAnswer,
      });

      if (!parsedData.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: parsedData.error.issues[0].message,
          path: [...parsedData.error.issues[0].path],
        });

        return false;
      }
    } else if (val.type === "NUMERIC") {
      const parsedData = numericSchema.safeParse({
        correctAnswer: val.correctAnswer,
      });

      if (!parsedData.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: parsedData.error.issues[0].message,
          path: [...parsedData.error.issues[0].path],
        });

        return false;
      }
    }

    return true;
  });