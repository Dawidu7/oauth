"use server"

import * as context from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "./lucia"

type SessionUser = {
  userId: string
  email: string
  handle: string
  name: string
  createdAt: Date
}

export async function getSession() {
  const authRequest = auth.handleRequest("GET", context)
  const session = await authRequest.validate()

  return {
    session,
    user: session?.user as SessionUser | undefined,
    protect: ({ redirectUrl = "/", sessionExists = true }) => {
      if (!session === sessionExists) {
        return redirect(redirectUrl)
      }
    },
  }
}
