import { lucia } from "lucia"
import { nextjs_future } from "lucia/middleware"
import { github, google } from "@lucia-auth/oauth/providers"
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

export const googleAuth = google(auth, {
  clientId: process.env.GOOGLE_ID ?? "",
  clientSecret: process.env.GOOGLE_SECRET ?? "",
  redirectUri: "http://localhost:3000/api/auth/google/callback",
  scope: [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
    "openid",
  ],
})

export type Auth = typeof lucia
