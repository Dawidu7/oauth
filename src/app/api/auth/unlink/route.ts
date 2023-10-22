import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getSession } from "~/auth/utils"
import db from "~/db"
import { keys } from "~/db/schema"

export async function POST(request: NextRequest) {
  const { user } = await getSession()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const provider = new URL(request.url).searchParams.get("provider")

  if (!provider) {
    return NextResponse.json({ error: "No provider" }, { status: 400 })
  }

  const userProviders = await db
    .select()
    .from(keys)
    .where(eq(keys.user_id, user.userId))
    .then(keys => keys.map(({ id }) => id.split(":")))

  if (userProviders.length === 1) {
    return NextResponse.json(
      { error: "Cannot unlink last provider" },
      { status: 400 },
    )
  }

  const selectedProvider = userProviders.find(([p]) => p === provider)

  if (!selectedProvider) {
    return NextResponse.json({ error: "Provider not linked" }, { status: 400 })
  }

  await db.delete(keys).where(eq(keys.id, selectedProvider.join(":")))

  return NextResponse.redirect(new URL("/", request.url), { status: 302 })
}
