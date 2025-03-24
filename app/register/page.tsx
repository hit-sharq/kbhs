"use client"

import { useState } from "react"
import Link from "next/link"
import { register } from "@/app/actions"
import styles from "./register.module.css"

export default function RegisterPage() {
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    try {
      const result = await register(formData)

      if (result?.error) {
        setError(result.error)
      }
    } catch (err) {
      console.error("Registration error:", err)
      setError("An error occurred during registration. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.registerPage}>
      <div className={styles.formContainer}>
        <h1>Register for KBHS Teacher Notes</h1>
        <p>Create an account to manage your subject notes</p>

        {error && <div className={styles.error}>{error}</div>}

        <form action={handleSubmit} className={styles.form}>
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Full Name
            </label>
            <input type="text" id="name" name="name" className="form-control" required spellCheck="false" />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input type="email" id="email" name="email" className="form-control" required spellCheck="false" />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              required
              autoComplete="new-password"
            />
          </div>

          <button type="submit" className="btn" disabled={isSubmitting}>
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </form>

        <p className={styles.loginLink}>
          Already have an account? <Link href="/login">Login here</Link>
        </p>
      </div>
    </div>
  )
}

