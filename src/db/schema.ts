import type { InferInsertModel } from "drizzle-orm"
import { bigint, date, pgTable, varchar } from "drizzle-orm/pg-core"

export const users = pgTable("users", {
  id: varchar("id", { length: 15 }).primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  handle: varchar("handle", { length: 20 }).notNull().unique(),
  name: varchar("name", { length: 20 }).notNull(),
  createdAt: date("created_at").defaultNow(),
})

export type User = InferInsertModel<typeof users>

export const keys = pgTable("keys", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 15 })
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),
  hashedPassword: varchar("hashed_password", { length: 255 }),
})

export type Key = InferInsertModel<typeof keys>

export const sessions = pgTable("sessions", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 15 })
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),
  activeExpires: bigint("active_expires", { mode: "bigint" }).notNull(),
  idleExpires: bigint("idle_expires", { mode: "bigint" }).notNull(),
})

export type Session = InferInsertModel<typeof sessions>
