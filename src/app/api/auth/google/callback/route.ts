import { cookies, headers } from "next/headers"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { OAuthRequestError } from "@lucia-auth/oauth"
import { auth, googleAuth } from "~/auth/lucia"
import db from "~/db"

export async function GET(request: NextRequest) {
  const storedState = cookies().get("google_oauth_state")?.value
  const url = new URL(request.url)
  const state = url.searchParams.get("state")
  const code = url.searchParams.get("code")

  if (!storedState || !state || storedState !== state || !code) {
    return NextResponse.json(null, { status: 400 })
  }
  try {
    const { createUser, getExistingUser, googleUser } =
      await googleAuth.validateCallback(code)

    async function getUser() {
      const exisitingUser = await getExistingUser()

      if (exisitingUser) return exisitingUser

      const existingDatabaseUserWithEmail = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.email, googleUser.email!),
      })

      if (existingDatabaseUserWithEmail) {
        const user = auth.transformDatabaseUser(existingDatabaseUserWithEmail)

        await auth.createKey({
          userId: user.userId,
          providerId: "google",
          providerUserId: googleUser.sub,
          password: null,
        })

        return user
      }

      return await createUser({
        attributes: {
          email: googleUser.email,
          handle: googleUser.name.toLowerCase(),
          name: googleUser.name,
        },
      })
    }

    const user = await getUser()
    const session = await auth.createSession({
      userId: user.userId,
      attributes: {},
    })
    const authRequest = auth.handleRequest(request.method, { cookies, headers })
    authRequest.setSession(session)

    return NextResponse.redirect(new URL("/", request.url), { status: 302 })
  } catch (e) {
    if (e instanceof OAuthRequestError) {
      return NextResponse.json(null, { status: 400 })
    }

    console.error(e)

    return NextResponse.json("Internal Server Error", { status: 500 })
  }
}
