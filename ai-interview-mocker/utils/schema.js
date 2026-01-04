import { pgTable, serial, text, varchar, integer, jsonb, timestamp, uuid } from "drizzle-orm/pg-core";

export const mockInterview = pgTable("mockInterview", {
  id: serial("id").primaryKey(),
  userId: varchar("userId", { length: 255 }).notNull(),
  jsonMockResp: jsonb("jsonMockResp").notNull(),
  jobPosition: varchar("jobPosition", { length: 255 }).notNull(),
  jobDesc: text("jobDesc").notNull(),
  jobExperience: integer("jobExperience").notNull(),
  createdBy: varchar("createdBy", { length: 255 }).notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow(),
  mockId: uuid("mockId").notNull(),
});

export const userAnswers = pgTable("userAnswers", {
  id: serial("id").primaryKey(),
  userId: varchar("userId", { length: 255 }).notNull(),
  interviewId: integer("interviewId").notNull().references(() => mockInterview.id),
  questionIndex: integer("questionIndex").notNull(), // <-- add this
  answerText: text("answerText").notNull(),
  transcript: text("transcript").notNull(),
  evaluationScore: integer("evaluationScore"),
  evaluationReport: jsonb("evaluationReport"),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow(),
});

// Parent table for quizzes
export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  userId: varchar("userId", { length: 255 }).notNull(),
  topic: varchar("topic", { length: 255 }).notNull(),
  level: varchar("level", { length: 50 }).notNull(),
  questionCount: integer("questionCount").notNull(),
  timeLimit: integer('time_limit').default(60),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow(),
});


// Schema for quiz questions
export const quizQuestions = pgTable("quizQuestions", {
  id: serial("id").primaryKey(),
  quizId: integer("quizId").notNull().references(() => quizzes.id),
  userId: varchar("userId", {length : 255}).notNull(),
  questionText: text("questionText").notNull(),
  options: jsonb("options").notNull(),  // [A B C D]
  correctAnswer: text("correctAnswer").notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow(),
})

export const quizAnswers = pgTable("quizAnswers", {
  id: serial("id").primaryKey(),
  userId: varchar("userId", { length: 255 }).notNull(),
  questionId: integer("questionId").notNull().references(() => quizQuestions.id),
  resultId: integer("resultId").references(() => quizResults.id), // Link to specific quiz attempt
  selectedAnswer: text("selectedAnswer").notNull(),
  isCorrect: integer("isCorrect").notNull(), // 1 = correct, 0 = wrong
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow(),
});

export const quizResults = pgTable("quizResults", {
  id: serial("id").primaryKey(),
  userId: varchar("userId", { length: 255 }).notNull(),
  quizId: integer("quizId").notNull().references(() => quizzes.id),
  score: integer("score").notNull(),
  totalQuestions: integer("totalQuestions").notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow(),
});
