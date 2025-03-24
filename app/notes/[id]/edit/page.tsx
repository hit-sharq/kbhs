"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { updateNote } from "@/app/actions"
import styles from "./edit-note.module.css"

interface Subject {
  id: string
  name: string
}

interface Note {
  id: string
  title: string
  content: string
  topic: string
  subjectId: string
}

export default function EditNotePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [note, setNote] = useState<Note | null>(null)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

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
        setIsLoading(true)
        // Fetch note data
        const noteResponse = await fetch(`/api/notes/${params.id}`)
        if (!noteResponse.ok) {
          throw new Error(`Failed to fetch note: ${noteResponse.status}`)
        }
        const noteData = await noteResponse.json()

        // Fetch subjects
        const subjectsResponse = await fetch("/api/subjects")
        if (!subjectsResponse.ok) {
          throw new Error(`Failed to fetch subjects: ${subjectsResponse.status}`)
        }
        const subjectsData = await subjectsResponse.json()

        setNote(noteData)

        // Ensure subjects is an array
        if (Array.isArray(subjectsData)) {
          setSubjects(subjectsData)
        } else {
          console.error("API did not return an array for subjects:", subjectsData)
          setSubjects([])
          setError("Failed to load subjects. Unexpected data format.")
        }

        setFormData({
          id: noteData.id,
          title: noteData.title,
          subject: noteData.subjectId,
          topic: noteData.topic,
          content: noteData.content,
        })
      } catch (error) {
        console.error("Error loading data:", error)
        setError("Error loading data: " + (error as Error).message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params.id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    try {
      const result = await updateNote(formData)

      if (result?.error) {
        setError(result.error)
      }
    } catch (err) {
      console.error("Error updating note:", err)
      setError("Failed to update note. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <div className="loading">Loading...</div>
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
            spellCheck="false"
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
            {Array.isArray(subjects) &&
              subjects.map((subject) => (
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
            spellCheck="false"
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
            spellCheck="false"
          />
        </div>

        <div className={styles.formActions}>
          <button type="button" className="btn" onClick={() => router.back()} disabled={isSubmitting}>
            Cancel
          </button>
          <button type="submit" className="btn" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update Note"}
          </button>
        </div>
      </form>
    </div>
  )
}

