import "~/globals.css"

export default function Layout({ children }: Children) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
