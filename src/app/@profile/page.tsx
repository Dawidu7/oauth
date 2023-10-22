import { BsPersonFill, BsGithub, BsGoogle } from "react-icons/bs"
import { getSession } from "~/auth/utils"
import db from "~/db"

export default async function Profile() {
  const { user } = await getSession()

  const providers = await db.query.keys
    .findMany({
      where: (keys, { eq }) => eq(keys.user_id, user!.userId),
    })
    .then(keys => keys.map(({ id }) => id.split(":")[0]))

  return (
    <>
      <section>
        <h1>Weclome, {user!.name}</h1>
        <span>Joined {user!.createdAt!.toLocaleDateString()}</span>
      </section>
      <form method="POST">
        <button
          type="submit"
          formAction="/api/auth/unlink?provider=credentials"
          className="flex items-center gap-2 text-xl"
        >
          <BsPersonFill />
          {providers.includes("email") || providers.includes("username")
            ? "Linked"
            : "Unlinked"}
        </button>
        <button
          type="submit"
          formAction="/api/auth/unlink?provider=github"
          className="flex items-center gap-2 text-xl"
        >
          <BsGithub />
          {providers.includes("github") ? "Linked" : "Unlinked"}
        </button>
        <button
          type="submit"
          formAction="/api/auth/unlink?provider=google"
          className="flex items-center gap-2 text-xl"
        >
          <BsGoogle />
          {providers.includes("google") ? "Linked" : "Unlinked"}
        </button>
      </form>
      <form action="/api/auth/sign-out" method="POST">
        <h1>Sign Out</h1>
        <hr />
        <input type="submit" value="Sign Out" />
      </form>
    </>
  )
}
