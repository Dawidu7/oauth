import type { Config } from "drizzle-kit"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set.")
}

export default {
  dbCredentials: {
    connectionString: process.env.DATABASE_URL,
  },
  driver: "pg",
  out: "src/db/migrations",
  schema: "src/db/schema.ts",
} satisfies Config
