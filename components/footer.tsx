import ClientOnly from "./client-only"

export default function Footer() {
  return (
    <footer className="footer">
      <ClientOnly>
        <p>© {new Date().getFullYear()} KASIKEU BOYS HIGH SCHOOL</p>
      </ClientOnly>
    </footer>
  )
}

