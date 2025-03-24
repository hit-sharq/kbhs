import Link from "next/link"
import Image from "next/image"
import { logout } from "@/app/actions"
import ClientOnly from "./client-only"
import styles from "./header.module.css"

export default function Header({ user }: { user: any }) {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link href="/">
          <div className={styles.logoContainer}>
            <Image src="/images/kb-logo.png" alt="KBHS Logo" width={50} height={50} className={styles.logoImage} />
            <div className={styles.logoText}>
              <h1>KBHS</h1>
              <p>Teacher Notes</p>
            </div>
          </div>
        </Link>
      </div>
      <nav className={styles.nav}>
        <ul>
          <li>
            <Link href="/">Home</Link>
          </li>
          <ClientOnly>
            {user ? (
              <>
                <li>
                  <Link href="/dashboard">Dashboard</Link>
                </li>
                <li>
                  <Link href="/subjects">Subjects</Link>
                </li>
                <li>
                  <Link href="/add-note">Add Note</Link>
                </li>
                <li>
                  <form action={async (formData) => {
                    await logout();
                  }}>
                    <button type="submit" className={styles.logoutButton}>
                      Logout
                    </button>
                  </form>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/login">Login</Link>
                </li>
                <li>
                  <Link href="/register">Register</Link>
                </li>
              </>
            )}
          </ClientOnly>
        </ul>
      </nav>
    </header>
  )
}

