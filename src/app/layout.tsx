import { getSession } from "~/auth/utils"
import "~/globals.css"

export default async function Layout({
  profile,
  signIn,
  signUp,
}: Children & {
  profile: React.ReactNode
  signIn: React.ReactNode
  signUp: React.ReactNode
}) {
  const { session } = await getSession()

  return (
    <html lang="en">
      <body className="grid min-h-screen place-items-center bg-neutral-200">
        <main className="flex w-full items-center justify-evenly">
          {session ? (
            profile
          ) : (
            <>
              {signIn}
              {signUp}
            </>
          )}
        </main>
      </body>
    </html>
  )
}
