'use client'

import Link from 'next/dist/client/link'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="error-page">
      <div className="error-card">
        <div className="error-code">500</div>
        <h1 className="error-title">Something went wrong</h1>
        <p className="error-message">
          An unexpected error occurred. Please try again or contact support if the problem persists.
        </p>
        <div className="error-btn-group">
          <button className="error-btn-primary" onClick={() => reset()}>
            Try again
          </button>
          <Link href="/" className="error-btn-secondary">
            Go home
          </Link>
        </div>
      </div>
    </div>
  )
}