"use server"

import { Suspense } from "react"
import NewProjectForm from "./page-form"

export default async function NewSessionPage() {
  return (
    <Suspense fallback={<NewSessionFallback />}>
      <NewProjectForm userId={"1"} />
    </Suspense>
  )
}

/**
 * NewSessionFallback
 * ------------------
 * Simple skeleton or placeholder while the form is loading.
 */
function NewSessionFallback() {
  return (
    <div className="mx-auto max-w-xl p-6 text-center">
      <h2 className="mb-4 text-lg font-semibold">Loading...</h2>
      <p className="text-muted-foreground">Preparing the new session form...</p>
    </div>
  )
}
