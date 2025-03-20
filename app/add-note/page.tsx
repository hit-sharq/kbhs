"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createNote } from "@/app/actions"
import styles from "./add-note.module.css"

export default function AddNotePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const subjectId = searchParams.get("subject")
  const [subjects, setSubjects] = useState([])
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    title: "",
    subject: subjectId || "",
    topic: "",
    content: "",
  })

  useEffect(() => {
    // Fetch subjects taught by the current user
    async function fetchSubjects() {
      const response = await fetch("/api/subjects")
      const data = await response.json()
      setSubjects(data)
    }

    fetchSubjects()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(formData) {
    const result = await createNote(formData)

    if (result?.error) {
      setError(result.error)
    }
  }

  return (
    <div className={styles.addNotePage}>
      <h1>Add New Note</h1>
      <p>Create a new note for your subject</p>

      {error && <div className={styles.error}>{error}</div>}

      <form action={handleSubmit} className={styles.form}>
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
            Save Note
          </button>
        </div>
      </form>
    </div>
  )
}

