export default function Home() {
  return (
    <div className="flex w-full justify-evenly">
      <form action="/api/sign-in" method="POST">
        <h1>Sign In</h1>
        <hr />
        <input type="text" name="name" placeholder="Email or Name" />
        <input type="password" name="password" placeholder="Password" />
        <input type="submit" value="Sign In" />
      </form>
      <form action="/api/sign-up" method="POST">
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
