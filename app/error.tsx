"use client"

import { useEffect } from "react"
import styles from "./error.module.css"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error)
  }, [error])

  return (
    <div className={styles.errorContainer}>
      <h2>Something went wrong!</h2>
      <p>{error.message || "An unexpected error occurred"}</p>
      <button
        className="btn"
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  )
}

