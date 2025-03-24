"use client"

import { useState } from "react"
import Link from "next/link"
import { login } from "../actions" // Updated import path
import styles from "./login.module.css"

export default function LoginPage() {
  const [error, setError] = useState("")

  async function handleSubmit(formData: FormData) {
    const result = await login(formData)

    if (result?.error) {
      setError(result.error)
    }
  }

  return (
    <div className={styles.loginPage}>
      <div className={styles.formContainer}>
        <h1>Login to KBHS Teacher Notes</h1>
        <p>Enter your credentials to access your account</p>

        {error && <div className={styles.error}>{error}</div>}

        <form action={handleSubmit} className={styles.form}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input type="email" id="email" name="email" className="form-control" required />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input type="password" id="password" name="password" className="form-control" required />
          </div>

          <button type="submit" className="btn">
            Login
          </button>
        </form>

        <p className={styles.registerLink}>
          Don't have an account? <Link href="/register">Register here</Link>
        </p>
      </div>
    </div>
  )
}
