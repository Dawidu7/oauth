"use server"

import * as context from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "./lucia"

export async function getSession() {
  const authRequest = auth.handleRequest("GET", context)
  const session = await authRequest.validate()

  return {
    session,
    protect: ({ redirectUrl = "/", sessionExists = true }) => {
      if (!session === sessionExists) {
        return redirect(redirectUrl)
      }
    },
  }
}
