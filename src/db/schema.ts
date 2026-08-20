import { index } from "drizzle-orm/pg-core";
import {
  uuid,
  pgTable,
  varchar,
  timestamp,
  date,
  text,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";

export const userTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: varchar("username", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  otpHash: varchar("otp_hash", { length: 255 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  verificationId: uuid("verification_id").defaultRandom(),
});

export const scheduleTable = pgTable(
  "schedules",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => userTable.id)
      .notNull(),
    date: date("date", { mode: "string" }).notNull(),
  },
  (table) => [index("schedules_user_id_idx").on(table.userId)],
);

export const taskStatuses = [
  "pending",
  "in_progress",
  "completed",
  "cancelled",
] as const;

export type TaskStatus = (typeof taskStatuses)[number];

export const taskStatusEnum = pgEnum("task_status", taskStatuses);

export const taskTable = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  scheduleId: uuid("schedule_id")
    .references(() => scheduleTable.id)
    .notNull(),
  title: varchar("title", { length: 255 }),
  status: taskStatusEnum("status").notNull().default("pending"),
  startTime: timestamp("start_time"),
  endTIme: timestamp("end_time"),
});

export const feedbackTable = pgTable("feedbacks", {
  id: uuid("id").primaryKey().defaultRandom(),
  scheduleId: uuid("schedule_id")
    .references(() => scheduleTable.id)
    .notNull(),
  text: text("text").notNull(),
});
