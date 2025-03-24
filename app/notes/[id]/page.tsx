import Link from "next/link"
import { getCurrentUser } from "@/lib/auth"
import prisma from "@/lib/db"
import { deleteNote } from "@/app/actions"
import styles from "./note.module.css"

export default async function NotePage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser()

  if (!user) {
    return null // Middleware will handle redirect
  }

  try {
    const note = await prisma.note.findUnique({
      where: { id: params.id },
      include: {
        subject: true,
        teacher: {
          select: { id: true, name: true },
        },
      },
    })

    if (!note) {
      return <div>Note not found</div>
    }

    const isOwner = note.teacher.id === user.id

    return (
      <div className={styles.notePage}>
        <div className={styles.header}>
          <h1>{note.title}</h1>
          <div className={styles.meta}>
            <p>
              Subject: <Link href={`/subjects/${note.subject.id}`}>{note.subject.name}</Link>
            </p>
            <p>Topic: {note.topic}</p>
            <p>Date: {new Date(note.updatedAt).toLocaleDateString()}</p>
            <p>Teacher: {note.teacher.name}</p>
          </div>
        </div>

        {isOwner && (
          <div className={styles.actions}>
            <Link href={`/notes/${note.id}/edit`} className="btn">
              Edit Note
            </Link>
            <form
              action={async () => {
                "use server"
                await deleteNote(note.id)
              }}
            >
              <button type="submit" className="btn btn-danger">
                Delete Note
              </button>
            </form>
          </div>
        )}

        <div className={styles.content}>
          {/* This would typically use a markdown renderer */}
          <div dangerouslySetInnerHTML={{ __html: note.content.replace(/\n/g, "<br>") }} />
        </div>
      </div>
    )
  } catch (error) {
    console.error("Note page error:", error)
    return (
      <div className="error">
        <p>An error occurred while loading the note. Please try again later.</p>
      </div>
    )
  }
}

