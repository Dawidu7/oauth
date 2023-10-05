import { BsGithub, BsGoogle } from "react-icons/bs"

export default function SignIn() {
  return (
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
  )
}
