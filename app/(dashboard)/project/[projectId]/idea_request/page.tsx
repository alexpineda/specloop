/**
 * The chat is complete and this the finalized idea request.
 */
"use server"

import { Suspense } from "react"
import { redirect } from "next/navigation"
import { getProjectByIdAction } from "@/actions/db/projects-actions"
import { Skeleton } from "@/components/ui/skeleton"
import IdeaRequestStage from "./_components/idea-request-stage"
import { updateRequestFromTextChats } from "@/actions/db/messages-actions"

interface IdeationPageProps {
  params: {
    projectId: string
  }
}

export default async function IdeaRequestPage({ params }: IdeationPageProps) {
  const projectId = params.projectId

  return (
    <Suspense fallback={<IdeationSkeleton />}>
      <IdeationFetcher projectId={projectId} />
    </Suspense>
  )
}

/**
 * IdeationFetcher
 * Fetches the chat session and its messages from the DB,
 * then renders the IdeationStage client component.
 */
async function IdeationFetcher({ projectId }: { projectId: string }) {
  // Validate the session
  const sessionRes = await getProjectByIdAction(projectId)
  if (!sessionRes.isSuccess || !sessionRes.data) {
    throw new Error(sessionRes.message || "Could not retrieve chat session.")
  }

  if (sessionRes.data.ideaRequest === null) {
    const ideaRes = await updateRequestFromTextChats(projectId)
    if (!ideaRes.isSuccess) {
      throw new Error(ideaRes.message || "Could not summarize chat.")
    }
    sessionRes.data.ideaRequest = ideaRes.data
  }

  return (
    <IdeaRequestStage
      projectId={sessionRes.data.id}
      ideaRequest={sessionRes.data.ideaRequest}
    />
  )
}

/**
 * IdeationSkeleton
 * A basic fallback while session & messages data is being fetched.
 */
function IdeationSkeleton() {
  return (
    <div className="p-4">
      <Skeleton className="mb-4 h-6 w-2/3" />
      <Skeleton className="mb-2 h-4 w-1/2" />
      <Skeleton className="mb-2 h-4 w-3/4" />
      <Skeleton className="mb-2 h-4 w-1/3" />
    </div>
  )
}
