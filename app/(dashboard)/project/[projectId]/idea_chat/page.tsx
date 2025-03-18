/**
 * Idea chat -> idea request (document)
 */
"use server"

import { Suspense } from "react"
import { redirect } from "next/navigation"
import { getProjectByIdAction } from "@/actions/db/projects-actions"
import { getMessagesByChatIdAction } from "@/actions/db/messages-actions"
import { Skeleton } from "@/components/ui/skeleton"
import IdeationStage from "./_components/idea-chat-stage"

interface IdeatChatPageProps {
  params: Promise<{ projectId: string }>
}

export default async function IdeaChatPage({ params }: IdeatChatPageProps) {
  const projectId = (await params).projectId

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

  // Fetch messages
  const msgsRes = await getMessagesByChatIdAction(projectId)
  const messages = msgsRes.isSuccess ? msgsRes.data : []

  return (
    <IdeationStage projectId={sessionRes.data.id} initialMessages={messages} />
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
