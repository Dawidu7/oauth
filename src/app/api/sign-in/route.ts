import * as context from "next/headers"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { LuciaError } from "lucia"
import auth from "~/auth/lucia"
import { EMAIL_REGEX, NAME_REGEX, PASSWORD_REGEX_1 } from "~/lib/utils"

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const _name = formData.get("name")
  const password = formData.get("password")

  if (typeof _name === "string") {
    if (_name.toString().includes("@") && !EMAIL_REGEX.test(_name)) {
      return NextResponse.json({ error: "Invalid Email" }, { status: 400 })
    }

    if (!_name.toString().includes("@") && !NAME_REGEX.test(_name)) {
      return NextResponse.json({ error: "Invalid Name" }, { status: 400 })
    }
  } else {
    return NextResponse.json({ error: "Invalid Name" }, { status: 400 })
  }

  if (typeof password !== "string" || !PASSWORD_REGEX_1.test(password)) {
    return NextResponse.json({ error: "Invalid Password" }, { status: 400 })
  }

  try {
    // Authenticate User
    const name = _name!.toString()
    const key = await auth.useKey(
      name.includes("@") ? "email" : "username",
      name,
      password,
    )

    // Create Session
    const session = await auth.createSession({
      userId: key.userId,
      attributes: {},
    })

    // Handle Request
    const authRequest = auth.handleRequest(request.method, context)
    authRequest.setSession(session)

    return NextResponse.redirect(new URL("/", request.url), { status: 302 })
  } catch (e) {
    if (
      e instanceof LuciaError &&
      (e.message === "AUTH_INVALID_KEY_ID" ||
        e.message === "AUTH_INVALID_PASSWORD")
    ) {
      return NextResponse.json(
        { error: "Invalid Credentials" },
        { status: 400 },
      )
    }

    console.error(e)

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    )
  }
}
