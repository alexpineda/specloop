"use server"
import { Suspense } from "react"
import { notFound, redirect } from "next/navigation"
// import { generateSpecAction } from "@/actions/ai/ai-actions"
import { updateProjectAction } from "@/actions/db/projects-actions"
import { getProjectByIdAction } from "@/actions/db/projects-actions"
import { Skeleton } from "@/components/ui/skeleton"

// CAREFUL: Our actual schema action is in "chat-sessions-actions". The type import is from "chat-sessions-schema".
// We'll fix the line in code to match the real usage.

interface GenerateSpecPageProps {
  params: {
    projectId: string
  }
}

export default async function GenerateSpecPage({
  params
}: GenerateSpecPageProps) {
  // We'll do the actual generation inside a Suspense wrapper
  return (
    <Suspense fallback={<GeneratingSpecFallback />}>
      <GenerateSpecFetcher projectId={params.projectId} />
    </Suspense>
  )
}

/**
 * GenerateSpecFetcher
 * -------------------
 * A server component that does the actual work of calling generateTechSpecAction
 * and then storing the spec in the DB. Afterwards, we redirect to /spec.
 */
async function GenerateSpecFetcher({
  projectId
}: {
  projectId: string
}): Promise<never> {
  const sessionRes = await getProjectByIdAction(projectId)
  if (!sessionRes.isSuccess || !sessionRes.data) {
    notFound()
  }

  // TODO: Reimplement
  // const generateRes = await generateSpecAction(projectId)
  // if (!generateRes.isSuccess) {
  //   // We could throw or handle differently, but let's just show an error
  //   throw new Error(generateRes.message || "Failed to generate spec.")
  // }

  // const updated = await updateProjectAction(projectId, {
  //   spec: generateRes.data.specContent
  // })
  // if (!updated.isSuccess) {
  //   throw new Error(updated.message || "Failed to save final spec.")
  // }

  // 4) Redirect to the /spec route
  redirect(`/project/${projectId}/spec`)

  // Since we do an immediate redirect, no need to return anything
}

/**
 * GeneratingSpecFallback
 * -----------------------
 * A simple fallback skeleton or message that the user sees while
 * we're generating the spec in the background.
 */
function GeneratingSpecFallback() {
  return (
    <div className="mx-auto max-w-md p-4 text-center">
      <h2 className="mb-4 text-xl font-semibold">
        Generating your initial spec...
      </h2>
      <Skeleton className="mb-2 h-4 w-full" />
      <Skeleton className="mb-2 h-4 w-5/6" />
      <Skeleton className="mb-2 h-4 w-2/3" />
    </div>
  )
}
