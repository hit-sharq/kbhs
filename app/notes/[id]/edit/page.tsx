"use client"

import { use, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { updateNote } from "@/app/actions"
import styles from "./edit-note.module.css"

interface Note {
  id: string;
  title: string;
  subjectId: string;
  topic: string;
  content: string;
}

interface Subject {
  id: string;
  name: string;
}

export default function EditNotePage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = use(paramsPromise)
  const router = useRouter()
  const [note, setNote] = useState<Note | null>(null)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [error, setError] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)

  const [formData, setFormData] = useState({
    id: "",
    title: "",
    subject: "",
    topic: "",
    content: "",
  })

  useEffect(() => {
    async function fetchData() {
      try {
        const noteResponse = await fetch(`/api/notes/${params.id}`)
        if (!noteResponse.ok) {
          throw new Error("Failed to fetch note")
        }
        const noteData: Note = await noteResponse.json()

        const subjectsResponse = await fetch("/api/subjects")
        if (!subjectsResponse.ok) {
          throw new Error("Failed to fetch subjects")
        }
        const subjectsData: Subject[] = await subjectsResponse.json()

        setNote(noteData)
        setSubjects(subjectsData)

        setFormData({
          id: noteData.id,
          title: noteData.title,
          subject: noteData.subjectId,
          topic: noteData.topic,
          content: noteData.content,
        })
      } catch (error) {
        setError(`Error loading data: ${(error as Error).message}`)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params.id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const data = new FormData();
    data.append("id", formData.id);
    data.append("title", formData.title);
    data.append("subject", formData.subject);
    data.append("topic", formData.topic);
    data.append("content", formData.content);

    const result = await updateNote(data);

    if (result?.error) {
      setError(result.error);
    } else {
      router.push("/notes");
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error && !note) {
    return <div className={styles.error}>{error}</div>
  }

  return (
    <div className={styles.editNotePage}>
      <h1>Edit Note</h1>
      <p>Update the details of your note</p>

      {error && <div className={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <input type="hidden" name="id" value={formData.id} />

        <div className="form-group">
          <label htmlFor="title" className="form-label">
            Note Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            className="form-control"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="subject" className="form-label">
            Subject
          </label>
          <select
            id="subject"
            name="subject"
            className="form-control"
            value={formData.subject}
            onChange={handleChange}
            required
          >
            <option value="">Select a subject</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="topic" className="form-label">
            Topic
          </label>
          <input
            type="text"
            id="topic"
            name="topic"
            className="form-control"
            value={formData.topic}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="content" className="form-label">
            Note Content
          </label>
          <textarea
            id="content"
            name="content"
            className="form-control"
            value={formData.content}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formActions}>
          <button type="button" className="btn" onClick={() => router.back()}>
            Cancel
          </button>
          <button type="submit" className="btn">
            Update Note
          </button>
        </div>
      </form>
    </div>
  )
}
