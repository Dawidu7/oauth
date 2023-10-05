import { cookies, headers } from "next/headers"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { OAuthRequestError } from "@lucia-auth/oauth"
import { auth, githubAuth } from "~/auth/lucia"
import db from "~/db"

export async function GET(request: NextRequest) {
  const storedState = cookies().get("github_oauth_state")?.value
  const url = new URL(request.url)
  const state = url.searchParams.get("state")
  const code = url.searchParams.get("code")

  if (!storedState || !state || storedState !== state || !code) {
    return NextResponse.json(null, { status: 400 })
  }
  try {
    const { createUser, getExistingUser, githubUser, githubTokens } =
      await githubAuth.validateCallback(code)

    githubUser.email =
      githubUser.email ?? (await getUserEmail(githubTokens.accessToken))

    async function getUser() {
      const exisitingUser = await getExistingUser()

      if (exisitingUser) return exisitingUser

      const existingDatabaseUserWithEmail = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.email, githubUser.email!),
      })

      if (existingDatabaseUserWithEmail) {
        const user = auth.transformDatabaseUser(existingDatabaseUserWithEmail)

        await auth.createKey({
          userId: user.userId,
          providerId: "github",
          providerUserId: githubUser.id.toString(),
          password: null,
        })

        return user
      }

      return await createUser({
        attributes: {
          email: githubUser.email,
          handle: githubUser.login.toLowerCase(),
          name: githubUser.name,
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

async function getUserEmail(accessToken: string) {
  return await fetch("https://api.github.com/user/emails", {
    headers: {
      Authorization: `token ${accessToken}`,
    },
  })
    .then(response => response.json())
    .then(emails => emails.find((email: any) => email.primary)?.email)
}
