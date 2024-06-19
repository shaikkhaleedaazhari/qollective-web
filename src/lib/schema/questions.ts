import {
  boolean,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { userTable } from "./auth";
import { createId } from "@paralleldrive/cuid2";
import { relations, sql } from "drizzle-orm";
import { QuizQuestion } from "../types";

export const examTypeTable = mysqlTable("exam_type", {
  id: varchar("id", {
    length: 255,
  })
    .$defaultFn(createId)
    .primaryKey(),
  examName: varchar("exam_name", {
    length: 255,
  }).notNull(),
  subjects: json("subjects").$type<string[]>().notNull(),
});

export const examTypeTableRelation = relations(examTypeTable, ({ many }) => ({
  questionBanks: many(questionBankTable),
}));

export const questionBankTable = mysqlTable("question_bank", {
  id: varchar("id", {
    length: 255,
  })
    .$defaultFn(createId)
    .primaryKey(),
  name: varchar("name", {
    length: 255,
  }).notNull(),
  examType: varchar("exam_type", {
    length: 255,
  })
    .notNull()
    .references(() => examTypeTable.id),
  userId: varchar("user_id", {
    length: 255,
  })
    .notNull()
    .references(() => userTable.id),
  subject: varchar("subject", {
    length: 255,
  }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const questionTable = mysqlTable("question", {
  id: varchar("id", {
    length: 255,
  })
    .$defaultFn(createId)
    .primaryKey(),
  questionBankId: varchar("question_bank_id", {
    length: 255,
  })
    .notNull()
    .references(() => questionBankTable.id),
  type: mysqlEnum("type", ["MCQ", "MSQ", "NUMERIC"]).notNull(),
  question: text("question").notNull(),
  options: json("options").$type<string[]>(),
  correctAnswer: json("correct_answer").$type<string[]>().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const questionBankRelation = relations(questionBankTable, ({ one, many }) => ({
  examType: one(examTypeTable, {
    fields: [questionBankTable.examType],
    references: [examTypeTable.id],
  }),
  userId: one(userTable, {
    fields: [questionBankTable.userId],
    references: [userTable.id],
  }),
  questions: many(questionTable),
}));

export const questionTableRelation = relations(questionTable, ({ one }) => ({
  questionBank: one(questionBankTable, {
    fields: [questionTable.questionBankId],
    references: [questionBankTable.id],
  }),
}));
export const questionOptionTable = mysqlTable("question_option", {
  id: varchar("id", {
    length: 255,
  })
    .$defaultFn(createId)
    .primaryKey(),
  questionId: varchar("question_id", {
    length: 255,
  })
    .notNull()
    .references(() => questionTable.id),
  text: text("text").notNull(),
  isCorrect: boolean("is_correct").notNull(),
});

export const quizTable = mysqlTable("quiz", {
  id: varchar("id", {
    length: 255,
  })
    .$defaultFn(createId)
    .primaryKey(),
  data: json("data").$type<QuizQuestion[]>().notNull(),
  mark: int("mark"),
  userId: varchar("user_id", {
    length: 255,
  })
    .notNull()
    .references(() => userTable.id),
  status: mysqlEnum("type", ["ongoing", "finished", "closed"]).notNull(),
  minutes: int("minutes").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
