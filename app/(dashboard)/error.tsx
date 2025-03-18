/*
<ai_context>
Route-specific error component for the dashboard.
</ai_context>
<recent_changes>
Created a dashboard-specific error component that uses the error page design.
</recent_changes>
*/

"use client"

import React from "react"
import ErrorPage from "./_components/error-page"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function DashboardError({ error, reset }: ErrorProps) {
  return <ErrorPage error={error} reset={reset} />
}
