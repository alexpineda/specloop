"use server"
import { Suspense } from "react"
import { getProjectByIdAction } from "@/actions/db/projects-actions"
import { Skeleton } from "@/components/ui/skeleton"
import SpecStage from "./_components/spec-stage"

interface SpecPageProps {
  params: Promise<{ projectId: string }>
}

export default async function SpecPage({ params }: SpecPageProps) {
  const projectId = (await params).projectId

  return (
    <Suspense fallback={<SpecSkeleton />}>
      <SpecFetcher projectId={projectId} />
    </Suspense>
  )
}

/**
 * SpecFetcher
 * -----------
 * A helper server component that fetches the session from DB,
 * then renders the SpecStage client component with the data.
 */
async function SpecFetcher({ projectId }: { projectId: string }) {
  const sessionRes = await getProjectByIdAction(projectId)

  if (!sessionRes.isSuccess || !sessionRes.data) {
    throw new Error(sessionRes.message || "Could not retrieve chat session.")
  }

  const session = sessionRes.data

  return <SpecStage chatId={session.id} initialSpec={session.spec || ""} />
}

/**
 * SpecSkeleton
 * ------------
 * A simple skeleton loader while data is fetching.
 */
function SpecSkeleton() {
  return (
    <div className="p-6">
      <Skeleton className="mb-4 h-4 w-3/4" />
      <Skeleton className="mb-2 h-4 w-1/2" />
      <Skeleton className="mb-2 h-4 w-1/3" />
      <Skeleton className="mt-4 h-10 w-full" />
    </div>
  )
}
