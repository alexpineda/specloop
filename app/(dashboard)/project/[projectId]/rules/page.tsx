"use server"
/**
 * @file page.tsx
 * @description
 * This server component handles the "Project Rules" sub-step for the ideation workflow.
 * It fetches the chat session from the database, then displays a client component where the user can
 * enter custom project rules. The user can then either go back, save, or proceed to the template step.
 *
 * Key features:
 * - Auth check (Clerk)
 * - Retrieves the session so we can display existing data if present
 * - Renders a client component (RulesStage)
 */

import { Suspense } from "react"
import { redirect } from "next/navigation"
import { getProjectByIdAction } from "@/actions/db/projects-actions"
import { Skeleton } from "@/components/ui/skeleton"
import RulesStage from "./_components/rules-stage"

interface RulesPageProps {
  params: Promise<{
    projectId: string
  }>
}

export default async function RulesPage({ params }: RulesPageProps) {
  return (
    <Suspense fallback={<RulesSkeleton />}>
      <RulesFetcher projectId={(await params).projectId} />
    </Suspense>
  )
}

/**
 * RulesFetcher
 * -----------------------
 * A helper server component that fetches the specified session from the DB,
 * then renders the client stage component with existing data if available.
 */
async function RulesFetcher({ projectId }: { projectId: string }) {
  const sessionRes = await getProjectByIdAction(projectId)
  if (!sessionRes.isSuccess || !sessionRes.data) {
    throw new Error(sessionRes.message || "Failed to load chat session.")
  }

  const session = sessionRes.data
  return (
    <RulesStage
      projectId={session.id}
      initialProjectRules={session.projectRules || ""}
    />
  )
}

/**
 * RulesSkeleton
 * ------------------------
 * A minimal skeleton fallback while fetching the session data.
 */
function RulesSkeleton() {
  return (
    <div className="p-4">
      <Skeleton className="mb-2 h-5 w-1/2" />
      <Skeleton className="mb-2 h-4 w-3/4" />
      <Skeleton className="mb-2 h-4 w-1/2" />
      <Skeleton className="mt-4 h-8 w-full" />
    </div>
  )
}
