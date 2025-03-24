import ClientOnly from "./client-only"

export default function Footer() {
  return (
    <footer className="footer">
      <ClientOnly>
        <p>© {new Date().getFullYear()} Kasikeu Boys High School. All rights reserved.</p>
      </ClientOnly>
    </footer>
  )
}

