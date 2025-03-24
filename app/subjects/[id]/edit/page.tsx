"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { updateSubject } from "@/app/actions"
import styles from "./edit-subject.module.css"

interface Subject {
  id: string
  name: string
  description: string
}

export default function EditSubjectPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [subject, setSubject] = useState<Subject | null>(null)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
  })

  useEffect(() => {
    async function fetchSubject() {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/subjects/${params.id}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch subject: ${response.status}`)
        }

        const data = await response.json()
        setSubject(data)
        setFormData({
          id: data.id,
          name: data.name,
          description: data.description || "",
        })
      } catch (error) {
        console.error("Error loading subject:", error)
        setError("Error loading subject: " + (error as Error).message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSubject()
  }, [params.id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    try {
      const result = await updateSubject(formData)

      if (result?.error) {
        setError(result.error)
      }
    } catch (err) {
      console.error("Error updating subject:", err)
      setError("Failed to update subject. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <div className="loading">Loading...</div>
  }

  if (error && !subject) {
    return <div className={styles.error}>{error}</div>
  }

  return (
    <div className={styles.editSubjectPage}>
      <h1>Edit Subject</h1>
      <p>Update the details of your subject</p>

      {error && <div className={styles.error}>{error}</div>}

      <form action={handleSubmit} className={styles.form}>
        <input type="hidden" name="id" value={formData.id} />

        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Subject Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            className="form-control"
            value={formData.description}
            onChange={handleChange}
            rows={4}
          />
        </div>

        <div className={styles.formActions}>
          <button type="button" className="btn" onClick={() => router.back()} disabled={isSubmitting}>
            Cancel
          </button>
          <button type="submit" className="btn" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update Subject"}
          </button>
        </div>
      </form>
    </div>
  )
}

