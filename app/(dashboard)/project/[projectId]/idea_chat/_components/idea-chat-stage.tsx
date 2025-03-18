"use client"

import { Button } from "@/components/ui/button"
import IdeationChat from "./idea-chat"
import { SelectMessage } from "@/db/schema/messages-schema"
import Link from "next/link"
import { StageHeader } from "@/components/stage/stage-header"
import { MessageSquare } from "lucide-react"

interface IdeationStageProps {
  /**
   * The unique ID of the chat session
   */
  projectId: string

  /**
   * The initial messages for the ideation chat, loaded from DB
   */
  initialMessages: SelectMessage[]
}

export default function IdeationStage({
  projectId,
  initialMessages
}: IdeationStageProps) {
  return (
    <div className="p-4">
      <StageHeader
        title="Let's chat about your idea"
        description="Refine your app concept by chatting with the AI below. Once you're satisfied with your idea, proceed to the next step (Request)."
        icon={MessageSquare}
        nextButton={
          <Link href={`/project/${projectId}/idea_request`}>
            <Button variant="default">Next: Request</Button>
          </Link>
        }
      />

      <IdeationChat chatId={projectId} initialMessages={initialMessages} />
    </div>
  )
}
