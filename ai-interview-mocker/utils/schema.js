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



