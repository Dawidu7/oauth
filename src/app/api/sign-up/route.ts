import * as context from "next/headers"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import type { PostgresError } from "postgres"
import auth from "~/auth/lucia"
import { EMAIL_REGEX, NAME_REGEX, PASSWORD_REGEX_1 } from "~/lib/utils"

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const attributes = {
    email: formData.get("email"),
    handle: formData.get("handle"),
    name: formData.get("name"),
  }
  const password = formData.get("password")

  if (
    typeof attributes.email !== "string" ||
    !EMAIL_REGEX.test(attributes.email as string)
  ) {
    return NextResponse.json({ error: "Invalid Email" }, { status: 400 })
  }

  if (
    typeof attributes.handle !== "string" ||
    !NAME_REGEX.test(attributes.handle)
  ) {
    return NextResponse.json({ error: "Invalid Handle" }, { status: 400 })
  }

  if (
    typeof attributes.name !== "string" ||
    !NAME_REGEX.test(attributes.name)
  ) {
    return NextResponse.json({ error: "Invalid Name" }, { status: 400 })
  }

  if (typeof password !== "string" || !PASSWORD_REGEX_1.test(password)) {
    return NextResponse.json({ error: "Invalid Password" }, { status: 400 })
  }

  try {
    // Create User
    const { userId } = await auth.createUser({
      attributes,
      key: {
        providerId: "email",
        providerUserId: attributes.email.toLowerCase(),
        password,
      },
    })

    await auth.createKey({
      userId,
      providerId: "username",
      providerUserId: attributes.handle.toLowerCase(),
      password,
    })

    // Create Session
    const session = await auth.createSession({
      userId,
      attributes: {},
    })

    // Handle Request
    const authRequest = auth.handleRequest(request.method, context)
    authRequest.setSession(session)

    return NextResponse.redirect(new URL("/", request.url), { status: 302 })
  } catch (e) {
    console.error(e)

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    )
  }
}
