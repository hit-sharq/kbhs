"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createNote } from "@/app/actions"
import styles from "./add-note.module.css"

interface Subject {
  id: string
  name: string
}

export default function AddNotePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const subjectId = searchParams.get("subject")
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    subject: subjectId || "",
    topic: "",
    content: "",
  })

  useEffect(() => {
    // Fetch subjects taught by the current user
    async function fetchSubjects() {
      setIsLoading(true)
      try {
        const response = await fetch("/api/subjects")

        if (!response.ok) {
          throw new Error(`Failed to fetch subjects: ${response.status}`)
        }

        const data = await response.json()

        // Ensure data is an array
        if (Array.isArray(data)) {
          setSubjects(data)
        } else {
          console.error("API did not return an array:", data)
          setSubjects([]) // Set to empty array if not an array
          setError("Failed to load subjects. Unexpected data format.")
        }
      } catch (err) {
        console.error("Error fetching subjects:", err)
        setSubjects([]) // Set to empty array on error
        setError("Failed to load subjects. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchSubjects()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    try {
      const result = await createNote(formData)

      if (result?.error) {
        setError(result.error)
      }
    } catch (err) {
      console.error("Error creating note:", err)
      setError("Failed to create note. Please try again.")
    } finally {
      setIsSubmitting(false)
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
            spellCheck="false"
          />
        </div>

        <div className="form-group">
          <label htmlFor="subject" className="form-label">
            Subject
          </label>
          {isLoading ? (
            <div>Loading subjects...</div>
          ) : (
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
          )}
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
            {isSubmitting ? "Saving..." : "Save Note"}
          </button>
        </div>
      </form>
    </div>
  )
}

