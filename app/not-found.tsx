import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="error-page">
      <div className="error-card">
        <div className="error-code">404</div>
        <h1 className="error-title">Page not found</h1>
        <p className="error-message">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link href="/authenticated/dashboard" className="error-btn-primary">
          ← Back to dashboard
        </Link>
      </div>
    </div>
  )
}