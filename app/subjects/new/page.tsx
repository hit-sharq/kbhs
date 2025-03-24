"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createSubject } from "@/app/actions"
import styles from "./new-subject.module.css"

export default function NewSubjectPage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    try {
      const result = await createSubject(formData)

      if (result?.error) {
        setError(result.error)
      }
    } catch (err) {
      console.error("Create subject error:", err)
      setError("An error occurred while creating the subject. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.newSubjectPage}>
      <h1>Add New Subject</h1>
      <p>Create a new subject that you teach</p>

      {error && <div className={styles.error}>{error}</div>}

      <form action={handleSubmit} className={styles.form}>
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Subject Name
          </label>
          <input type="text" id="name" name="name" className="form-control" required />
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea id="description" name="description" className="form-control" rows={4} />
        </div>

        <div className={styles.formActions}>
          <button type="button" className="btn" onClick={() => router.back()} disabled={isSubmitting}>
            Cancel
          </button>
          <button type="submit" className="btn" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Subject"}
          </button>
        </div>
      </form>
    </div>
  )
}

