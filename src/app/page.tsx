import { getSession } from "~/auth/utils"

export default async function Home() {
  const { session } = await getSession()

  return (
    <div className="flex w-full justify-evenly">
      <form action="/api/auth/sign-in" method="POST">
        <h1>Sign In</h1>
        <hr />
        <input type="text" name="name" placeholder="Email or Name" />
        <input type="password" name="password" placeholder="Password" />
        <input type="submit" value="Sign In" />
        <section className="flex items-center">
          <hr className="flex-1" />
          <p className="z-10 bg-white px-2">or</p>
          <hr className="flex-1" />
        </section>
        <input formAction="/api/auth/github" type="submit" value="Github" />
      </form>
      {session && (
        <form action="/api/auth/sign-out" method="POST">
          <h1>Sign Out</h1>
          <hr />
          <input type="submit" value="Sign Out" />
        </form>
      )}
      <form action="/api/auth/sign-up" method="POST">
        <h1>Sign Up</h1>
        <hr />
        <input type="email" name="email" placeholder="Email" />
        <input type="text" name="handle" placeholder="Handle" />
        <input type="text" name="name" placeholder="Name" />
        <input type="password" name="password" placeholder="Password" />
        <input type="submit" value="Sign Up" />
      </form>
    </div>
  )
}
