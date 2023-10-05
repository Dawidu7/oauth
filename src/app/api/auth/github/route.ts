import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { githubAuth } from "~/auth/lucia"

export async function POST() {
  const [url, state] = await githubAuth.getAuthorizationUrl()

  cookies().set("github_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60,
  })

  return NextResponse.redirect(url.toString(), { status: 302 })
}
