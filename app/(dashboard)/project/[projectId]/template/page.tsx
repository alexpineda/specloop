"use server"
/**
 * @file page.tsx
 * @description
 * This server component handles the "Starter Template" sub-step for the ideation workflow.
 * It fetches the chat session from the database, then displays a client component where the user can
 * enter a starter template. The user can then either go back to rules, save, or proceed to generate the spec.
 *
 * Key features:
 * - Auth check (Clerk)
 * - Retrieves the session so we can display existing data if present
 * - Renders a client component (TemplateStage)
 */

import { Suspense } from "react"
import { redirect } from "next/navigation"
import { getProjectByIdAction } from "@/actions/db/projects-actions"
import { Skeleton } from "@/components/ui/skeleton"
import TemplateStage from "./_components/template-stage"

interface TemplatePageProps {
  params: Promise<{
    projectId: string
  }>
}

export default async function TemplatePage({ params }: TemplatePageProps) {
  return (
    <Suspense fallback={<TemplateSkeleton />}>
      <TemplateFetcher projectId={(await params).projectId} />
    </Suspense>
  )
}

/**
 * TemplateFetcher
 * -----------------------
 * A helper server component that fetches the specified session from the DB,
 * then renders the client stage component with existing data if available.
 */
async function TemplateFetcher({ projectId }: { projectId: string }) {
  const sessionRes = await getProjectByIdAction(projectId)
  if (!sessionRes.isSuccess || !sessionRes.data) {
    throw new Error(sessionRes.message || "Failed to load chat session.")
  }

  const session = sessionRes.data
  return (
    <TemplateStage
      projectId={session.id}
      initialStarterTemplate={session.starterTemplate || ""}
    />
  )
}

/**
 * TemplateSkeleton
 * ------------------------
 * A minimal skeleton fallback while fetching the session data.
 */
function TemplateSkeleton() {
  return (
    <div className="p-4">
      <Skeleton className="mb-2 h-5 w-1/2" />
      <Skeleton className="mb-2 h-4 w-3/4" />
      <Skeleton className="mb-2 h-4 w-1/2" />
      <Skeleton className="mt-4 h-8 w-full" />
    </div>
  )
}
