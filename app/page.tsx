import Link from "next/link"
import Image from "next/image"
import styles from "./page.module.css"

export default function Home() {
  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <div className={styles.heroLogo}>
          <Image src="/images/kb-logo.png" alt="KBHS Logo" width={120} height={120} className={styles.logoImage} />
        </div>
        <h1>Welcome to KBHS Teacher Notes</h1>
        <p>A platform for Kasikeu Boys High School teachers to manage subject notes</p>
        <div className={styles.actions}>
          <Link href="/subjects" className="btn">
            Browse Subjects
          </Link>
          <Link href="/add-note" className="btn">
            Add New Note
          </Link>
        </div>
      </section>

      <section className={styles.features}>
        <div className={styles.feature}>
          <h2>Organize Notes</h2>
          <p>Keep all your teaching materials organized by subject and topic</p>
        </div>
        <div className={styles.feature}>
          <h2>Easy Access</h2>
          <p>Access your notes anytime, anywhere with our simple interface</p>
        </div>
        <div className={styles.feature}>
          <h2>Collaborate</h2>
          <p>Share knowledge with other teachers to improve education quality</p>
        </div>
      </section>
    </div>
  )
}

