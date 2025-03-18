"use server"
import { Suspense } from "react"
import { getProjectByIdAction } from "@/actions/db/projects-actions"
import { Skeleton } from "@/components/ui/skeleton"
import PlannerStage from "./_components/planner-stage"

interface PlanPageProps {
  params: Promise<{ projectId: string }>
}

export default async function PlanPage({ params }: PlanPageProps) {
  const projectId = (await params).projectId

  return (
    <Suspense fallback={<PlanSkeleton />}>
      <PlanFetcher projectId={projectId} />
    </Suspense>
  )
}

/**
 * PlanFetcher
 * -----------
 * A helper server component that fetches the chat session from DB,
 * then renders the PlannerStage client component with the data.
 */
async function PlanFetcher({ projectId }: { projectId: string }) {
  const projectRes = await getProjectByIdAction(projectId)
  if (!projectRes.isSuccess || !projectRes.data) {
    throw new Error(projectRes.message || "Could not retrieve chat session.")
  }

  const session = projectRes.data
  return (
    <PlannerStage
      projectId={session.id}
      initialPlan={session.implementationPlan || ""}
    />
  )
}

/**
 * PlanSkeleton
 * ------------
 * A simple skeleton loader while data is fetching.
 */
function PlanSkeleton() {
  return (
    <div className="p-6">
      <Skeleton className="mb-4 h-4 w-3/4" />
      <Skeleton className="mb-2 h-4 w-2/3" />
      <Skeleton className="mb-2 h-4 w-1/2" />
      <Skeleton className="mt-2 h-6 w-full" />
    </div>
  )
}
