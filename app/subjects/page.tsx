import Link from "next/link"
import { getCurrentUser } from "@/lib/auth"
import prisma from "@/lib/db"
import styles from "./subjects.module.css"

export default async function SubjectsPage() {
  const user = await getCurrentUser()

  if (!user) {
    return null // Middleware will handle redirect
  }

  // Get all subjects with note counts
  const subjects = await prisma.subject.findMany({
    include: {
      teacher: {
        select: { name: true },
      },
      _count: {
        select: { notes: true },
      },
    },
    orderBy: { name: "asc" },
  })

  return (
    <div className={styles.subjectsPage}>
      <div className={styles.header}>
        <h1>All Subjects</h1>
        <Link href="/subjects/new" className="btn">
          Add Subject
        </Link>
      </div>
      <p>Browse through all subjects taught at Kasikeu Boys High School</p>

      <div className={styles.subjectGrid}>
        {subjects.map((subject) => (
          <Link href={`/subjects/${subject.id}`} key={subject.id} className={styles.subjectCard}>
            <h2>{subject.name}</h2>
            <p className={styles.teacher}>Teacher: {subject.teacher.name}</p>
            <p className={styles.count}>{subject._count.notes} notes available</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

