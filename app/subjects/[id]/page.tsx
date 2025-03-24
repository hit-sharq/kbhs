import Link from "next/link"
import { getCurrentUser } from "@/lib/auth"
import prisma from "@/lib/db"
import { deleteSubject, deleteNote } from "@/app/actions"
import styles from "./subject.module.css"

export default async function SubjectPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser()

  if (!user) {
    return null // Middleware will handle redirect
  }

  try {
    const subject = await prisma.subject.findUnique({
      where: { id: params.id },
      include: {
        teacher: {
          select: { id: true, name: true },
        },
        notes: {
          orderBy: { updatedAt: "desc" },
        },
      },
    })

    if (!subject) {
      return <div>Subject not found</div>
    }

    const isOwner = subject.teacher.id === user.id

    return (
      <div className={styles.subjectPage}>
        <div className={styles.header}>
          <h1>{subject.name}</h1>
          <p className={styles.teacher}>Teacher: {subject.teacher.name}</p>
          <p className={styles.description}>{subject.description}</p>
        </div>

        <div className={styles.actions}>
          {isOwner && (
            <>
              <Link href={`/add-note?subject=${subject.id}`} className="btn">
                Add New Note
              </Link>
              <Link href={`/subjects/${subject.id}/edit`} className="btn">
                Edit Subject
              </Link>
              <form
                action={async () => {
                  "use server"
                  await deleteSubject(subject.id)
                }}
              >
                <button type="submit" className="btn btn-danger">
                  Delete Subject
                </button>
              </form>
            </>
          )}
        </div>

        <div className={styles.notesList}>
          <h2>Available Notes</h2>

          {subject.notes.length === 0 ? (
            <p>No notes available for this subject yet.</p>
          ) : (
            <table className={styles.notesTable}>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Topic</th>
                  <th>Date</th>
                  {isOwner && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {subject.notes.map((note) => (
                  <tr key={note.id}>
                    <td>
                      <Link href={`/notes/${note.id}`}>{note.title}</Link>
                    </td>
                    <td>{note.topic}</td>
                    <td>{new Date(note.updatedAt).toLocaleDateString()}</td>
                    {isOwner && (
                      <td className={styles.actions}>
                        <Link href={`/notes/${note.id}/edit`} className="btn">
                          Edit
                        </Link>
                        <form
                          action={async () => {
                            "use server"
                            await deleteNote(note.id)
                          }}
                        >
                          <button type="submit" className="btn btn-danger">
                            Delete
                          </button>
                        </form>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    )
  } catch (error) {
    console.error("Subject page error:", error)
    return (
      <div className="error">
        <p>An error occurred while loading the subject. Please try again later.</p>
      </div>
    )
  }
}

