/*
<ai_context>
Global error component for the entire application.
</ai_context>
<recent_changes>
Created a global error component that uses the same error page design.
</recent_changes>
*/

"use client"

import React from "react"
import ErrorPage from "./(dashboard)/_components/error-page"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: ErrorProps) {
  return (
    <html>
      <body>
        <ErrorPage error={error} reset={reset} />
      </body>
    </html>
  )
}
