import { bigint, boolean, date, pgTable, varchar } from "drizzle-orm/pg-core"

export const users = pgTable("users", {
  id: varchar("id", { length: 15 }).primaryKey(),
  email: varchar("email", { length: 255 }).unique(),
  handle: varchar("handle", { length: 20 }).unique(),
  name: varchar("name", { length: 20 }),
  createdAt: date("created_at").defaultNow(),
})

export const keys = pgTable("keys", {
  id: varchar("id", { length: 15 }).primaryKey(),
  userId: varchar("user_id", { length: 15 }).references(() => users.id, {
    onDelete: "cascade",
  }),
  hashedPassword: varchar("hashed_password", { length: 255 }),
  primary: boolean("primary"),
})

export const sessions = pgTable("sessions", {
  id: varchar("id", { length: 15 }).primaryKey(),
  userId: varchar("user_id", { length: 15 }).references(() => users.id, {
    onDelete: "cascade",
  }),
  activeExpires: bigint("active_expires", { mode: "bigint" }),
  idleExpires: bigint("idle_expires", { mode: "bigint" }),
})
