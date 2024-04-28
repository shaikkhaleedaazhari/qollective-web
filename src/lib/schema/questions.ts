import { boolean, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";
import { userTable } from "./auth";

export const questionBankTable = mysqlTable("question_bank", {
    id: varchar("id", {
        length: 255
    }).primaryKey(),
    name: varchar("name", {
        length: 255
    }).notNull(),
    userId: varchar("user_id", {
        length: 255
    }).notNull().references(() => userTable.id),
    subject: varchar("subject", {
        length: 255
    }).notNull(),
    description: text("description").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
})


export const questionTable = mysqlTable("question", {
    id: varchar("id", {
        length: 255
    }).primaryKey(),
    questionBankId: varchar("question_bank_id", {
        length: 255
    }).notNull().references(() => questionBankTable.id),
    type: mysqlEnum("type", ["MCQ", "MSQ", "NUMERIC"]),
    question: text("question").notNull(),
    options: text("options").notNull(),
    correctAnswer: varchar("correct_answer", {
        length: 255
    }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
})

export const questionOptionTable = mysqlTable("question_option", {
    id: varchar("id", {
        length: 255
    }).primaryKey(),
    questionId: varchar("question_id", {
        length: 255
    }).notNull().references(() => questionTable.id),
    text: text("text").notNull(),
    isCorrect: boolean("is_correct").notNull()
})