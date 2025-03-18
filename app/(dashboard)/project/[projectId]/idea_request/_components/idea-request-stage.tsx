/*
<ai_context>
Client component for displaying and editing the project idea request, with options to regenerate from chats.
</ai_context>
<recent_changes>
Added functionality to create chat messages when the user saves or regenerates the idea request, keeping the chat history in sync with manual edits.
Added a copy to clipboard button to allow users to easily copy the entire idea request.
*/

"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
import { useState } from "react"
import { updateProjectAction } from "@/actions/db/projects-actions"
import { useRouter } from "next/navigation"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import {
  createMessageAction,
  updateRequestFromTextChats
} from "@/actions/db/messages-actions"
import { StageHeader } from "@/components/stage/stage-header"
import { Copy, Lightbulb, RefreshCcw } from "lucide-react"
import { respondToUserChatMessageAction } from "@/actions/ai/ai-actions"

interface IdeaRequestStageProps {
  /**
   * The unique ID of the chat session
   */
  projectId: string

  /**
   * The initial messages for the ideation chat, loaded from DB
   */
  ideaRequest: string
}

export default function IdeaRequestStage({
  projectId,
  ideaRequest
}: IdeaRequestStageProps) {
  const [regenerate, setRegenerate] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedIdea, setEditedIdea] = useState(ideaRequest)
  const [isSaving, setIsSaving] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const router = useRouter()

  const handleRegenerate = async () => {
    setRegenerate(true)
    const ideaRes = await updateRequestFromTextChats(projectId)
    if (!ideaRes.isSuccess) {
      toast({
        title: "Error",
        description: ideaRes.message || "Could not summarize chat.",
        variant: "destructive"
      })
      setRegenerate(false)
      return
    }
    setEditedIdea(ideaRes.data)
    setRegenerate(false)
    router.refresh()
  }

  const handleSave = async () => {
    setIsSaving(true)
    const updateRes = await updateProjectAction(projectId, {
      ideaRequest: editedIdea
    })

    if (!updateRes.isSuccess) {
      toast({
        title: "Error",
        description: updateRes.message || "Failed to save changes.",
        variant: "destructive"
      })
      setIsSaving(false)
      return
    }

    const aiRes = await respondToUserChatMessageAction({
      chatId: projectId,
      userContent: `I've updated the project request, here is the latest version:\n\n${editedIdea}`
    })

    if (!aiRes.isSuccess) {
      console.error("Failed to add chat message:", aiRes.message)
      // We don't show this error to the user since the project update was successful
    }

    // // Add a chat message to record the user's update
    // const chatMessage = await createMessageAction({
    //   chatId: projectId,
    //   content: `I've updated the project request, here is the latest version:\n\n${editedIdea}`,
    //   role: "user"
    // })

    // if (!chatMessage.isSuccess) {
    //   console.error("Failed to add chat message:", chatMessage.message)
    //   // We don't show this error to the user since the project update was successful
    // }

    toast({
      title: "Success",
      description: "Changes saved and chat updated!"
    })
    setIsSaving(false)
    setIsEditing(false)
    router.refresh()
  }

  /**
   * handleCopy
   * Copies the idea request to the clipboard
   */
  const handleCopy = () => {
    const textToCopy = isEditing ? editedIdea : ideaRequest

    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        setIsCopied(true)
        toast({
          title: "Copied to clipboard",
          description: "Project request copied successfully",
          duration: 2000
        })

        // Reset the copied state after 2 seconds
        setTimeout(() => {
          setIsCopied(false)
        }, 2000)
      })
      .catch(err => {
        console.error("Failed to copy text: ", err)
        toast({
          title: "Copy failed",
          description: "Could not copy to clipboard",
          variant: "destructive",
          duration: 2000
        })
      })
  }

  return (
    <div className="mx-auto w-full p-4">
      <StageHeader
        title="Project Request"
        description="This is the final project request that will be used to generate the project."
        icon={Lightbulb}
        nextButton={
          <Link href={`/project/${projectId}/rules`}>
            <Button variant="default">Next: Project Rules</Button>
          </Link>
        }
      >
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false)
                  setEditedIdea(ideaRequest)
                }}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={handleRegenerate}
                disabled={regenerate}
              >
                <RefreshCcw className="mr-2 size-4" />
                {regenerate ? "Updating..." : "Update from Chats"}
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
              <Button
                variant="outline"
                onClick={handleCopy}
                disabled={isCopied}
              >
                <Copy className="mr-2 size-4" />
                {isCopied ? "Copied!" : "Copy"}
              </Button>
            </>
          )}
        </div>
      </StageHeader>

      {isEditing ? (
        <Textarea
          value={editedIdea}
          onChange={e => setEditedIdea(e.target.value)}
          className="min-h-[calc(100vh-250px)] w-full resize-none font-mono text-sm"
        />
      ) : (
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown>{editedIdea}</ReactMarkdown>
        </div>
      )}
    </div>
  )
}
