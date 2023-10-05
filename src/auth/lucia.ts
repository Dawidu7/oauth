import { lucia } from "lucia"
import { nextjs_future } from "lucia/middleware"
import adapter from "./adapter"

const auth = lucia({
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

export default auth

export type Auth = typeof lucia
