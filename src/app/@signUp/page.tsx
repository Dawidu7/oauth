export default function SignUp() {
  return (
    <form action="/api/auth/sign-up" method="POST">
      <h1>Sign Up</h1>
      <hr />
      <input type="email" name="email" placeholder="Email" />
      <input type="text" name="handle" placeholder="Handle" />
      <input type="text" name="name" placeholder="Name" />
      <input type="password" name="password" placeholder="Password" />
      <input type="submit" value="Sign Up" />
    </form>
  )
}
