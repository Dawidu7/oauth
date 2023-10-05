import "~/globals.css"

export default function Layout({ children }: Children) {
  return (
    <html lang="en">
      <body className="grid min-h-screen place-items-center bg-neutral-200">
        {children}
      </body>
    </html>
  )
}
