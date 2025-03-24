import Link from "next/link"
import { getCurrentUser } from "@/lib/auth"
import prisma from "@/lib/db"
import styles from "./dashboard.module.css"

// Define the NoteWithSubject type
type NoteWithSubject = {
  id: string
  title: string
  updatedAt: string
  subject: {
    name: string
  }
}

// Define the SubjectWithNoteCount type
type SubjectWithNoteCount = {
  id: string
  name: string
  _count: {
    notes: number
  }
}

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    return null // Middleware will handle redirect
  }

  try {
    // Get teacher's subjects
    const subjects = await prisma.subject.findMany({
      where: { teacherId: user.id },
      include: {
        _count: {
          select: { notes: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    })

    // Get teacher's recent notes
    const recentNotes = await prisma.note.findMany({
      where: { teacherId: user.id },
      include: {
        subject: true,
      },
      orderBy: { updatedAt: "desc" },
      take: 5,
    })

    return (
      <div className={styles.dashboardPage}>
        <div className={styles.welcome}>
          <h1>Welcome, {user.name}</h1>
          <p>Manage your subjects and notes from your dashboard</p>
        </div>

        <div className={styles.grid}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>Your Subjects</h2>
              <Link href="/subjects/new" className="btn">
                Add Subject
              </Link>
            </div>

            {subjects.length === 0 ? (
              <p className={styles.emptyState}>
                You haven't created any subjects yet. <Link href="/subjects/new">Create your first subject</Link>
              </p>
            ) : (
                <ul className={styles.subjectList}>
                {subjects.map((subject: SubjectWithNoteCount) => (
                  <li key={subject.id}>
                  <Link href={`/subjects/${subject.id}`} className={styles.subjectItem}>
                    <span className={styles.subjectName}>{subject.name}</span>
                    <span className={styles.noteCount}>{subject._count.notes} notes</span>
                  </Link>
                  </li>
                ))}
                </ul>
            )}
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>Recent Notes</h2>
              <Link href="/add-note" className="btn">
                Add Note
              </Link>
            </div>

            {recentNotes.length === 0 ? (
              <p className={styles.emptyState}>
                You haven't created any notes yet. <Link href="/add-note">Create your first note</Link>
              </p>
            ) : (
                <ul className={styles.noteList}>
                {recentNotes.map((note: NoteWithSubject) => (
                  <li key={note.id}>
                  <Link href={`/notes/${note.id}`} className={styles.noteItem}>
                    <span className={styles.noteTitle}>{note.title}</span>
                    <span className={styles.noteSubject}>{note.subject.name}</span>
                    <span className={styles.noteDate}>{new Date(note.updatedAt).toLocaleDateString()}</span>
                  </Link>
                  </li>
                ))}
                </ul>
            )}
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Dashboard error:", error)
    return (
      <div className="error">
        <p>An error occurred while loading your dashboard. Please try again later.</p>
      </div>
    )
  }
}

