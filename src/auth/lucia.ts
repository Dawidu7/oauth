import { lucia } from "lucia"
import { nextjs_future } from "lucia/middleware"
import { github } from "@lucia-auth/oauth/providers"
import adapter from "./adapter"

export const auth = lucia({
  adapter: adapter(),
  env: process.env.NODE_ENV === "development" ? "DEV" : "PROD",
  middleware: nextjs_future(),
  sessionCookie: {
    expires: false,
  },
  getUserAttributes: data => ({
    email: data.email,
    handle: data.handle,
    name: data.name,
    createdAt: data.createdAt,
  }),
})

export const githubAuth = github(auth, {
  clientId: process.env.GITHUB_ID ?? "",
  clientSecret: process.env.GITHUB_SECRET ?? "",
  scope: ["user:email"],
})

export type Auth = typeof lucia
