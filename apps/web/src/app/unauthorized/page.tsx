'use client'

import { useEffect, useMemo, useState } from 'react'

const DEFAULT_SECONDS = 5

export default function UnauthorizedPage() {
  const target = useMemo(() => process.env.NEXT_PUBLIC_AUTH_ENTRY_URL || '/', [])
  const [seconds, setSeconds] = useState(DEFAULT_SECONDS)

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(timer)
          window.location.href = target
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [target])

  return (
    <main style={{ maxWidth: 680, margin: '64px auto', padding: '0 16px', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Unauthorized</h1>
      <p>You are not authenticated or do not have permission to view this page.</p>
      <p>Redirecting to authentication entry in {seconds}s...</p>
      <p>
        If not redirected, <a href={target}>click here</a>.
      </p>
    </main>
  )
}
