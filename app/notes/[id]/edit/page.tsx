"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { updateNote } from "@/app/actions"
import styles from "./edit-note.module.css"

export default function EditNotePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [note, setNote] = useState(null)
  const [subjects, setSubjects] = useState([])
  const [error, setError] = useState("")
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
        // Fetch note data
        const noteResponse = await fetch(`/api/notes/${params.id}`)
        if (!noteResponse.ok) {
          throw new Error("Failed to fetch note")
        }
        const noteData = await noteResponse.json()

        // Fetch subjects
        const subjectsResponse = await fetch("/api/subjects")
        if (!subjectsResponse.ok) {
          throw new Error("Failed to fetch subjects")
        }
        const subjectsData = await subjectsResponse.json()

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
        setError("Error loading data: " + error.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params.id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(formData) {
    const result = await updateNote(formData)

    if (result?.error) {
      setError(result.error)
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

      <form action={handleSubmit} className={styles.form}>
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

