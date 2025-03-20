"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createSubject } from "@/app/actions"
import styles from "./new-subject.module.css"

export default function NewSubjectPage() {
  const router = useRouter()
  const [error, setError] = useState("")

  async function handleSubmit(formData: FormData) {
    const result = await createSubject(formData)

    if (result?.error) {
      setError(result.error)
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
          <button type="button" className="btn" onClick={() => router.back()}>
            Cancel
          </button>
          <button type="submit" className="btn">
            Create Subject
          </button>
        </div>
      </form>
    </div>
  )
}

