import { BsGithub, BsGoogle } from "react-icons/bs"
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
        <section>
          <hr />
          <p className="z-10 flex-none bg-white px-2">or</p>
          <hr />
        </section>
        <section>
          <button
            className="bg-slate-900 hover:bg-black"
            type="submit"
            formAction="/api/auth/github"
          >
            <BsGithub className="mx-auto h-6 w-6" />
          </button>
          <button
            className="bg-rose-500 hover:bg-rose-600"
            type="submit"
            formAction="/api/auth/google"
          >
            <BsGoogle className="mx-auto h-6 w-6" />
          </button>
        </section>
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
