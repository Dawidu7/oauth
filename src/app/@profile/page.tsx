import { getSession } from "~/auth/utils"
import db from "~/db"

export default async function Profile() {
  const { session } = await getSession()
  const providers = await getUserProviders(session.user.userId)

  // console.log(providers.map(({ id }) => id.split(":")[0]))

  return (
    <section className="flex flex-col gap-16">
      <h1 className="text-center text-5xl">Welcome, {session.user.name}</h1>
      <form className="mx-auto w-fit" action="/api/auth/sign-out" method="POST">
        <h1>Sign Out</h1>
        <hr />
        <input type="submit" value="Sign Out" />
      </form>
    </section>
  )
}

async function getUserProviders(userId: string) {
  return await db.query.keys.findMany({
    where: (keys, { eq }) => eq(keys.user_id, userId),
  })
}
