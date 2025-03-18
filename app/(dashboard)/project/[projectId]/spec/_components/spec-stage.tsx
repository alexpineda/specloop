"use client"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { updateProjectAction } from "@/actions/db/projects-actions"
import ReactMarkdown from "react-markdown"
import { GenerateModalButton } from "@/components/generate-modal-button"
import Link from "next/link"
import { StageHeader } from "@/components/stage/stage-header"
import { FileText } from "lucide-react"

interface SpecStageProps {
  chatId: string
  initialSpec: string
}

export default function SpecStage({ chatId, initialSpec }: SpecStageProps) {
  const [spec, setSpec] = useState<string>(initialSpec)
  const [isSaving, setIsSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const { toast } = useToast()
  /**
   * Saves the spec text in DB by calling updateChatSessionAction.
   */
  async function handleSaveSpec() {
    try {
      setIsSaving(true)
      const updateResult = await updateProjectAction(chatId, {
        spec: spec
      })
      if (!updateResult.isSuccess) {
        throw new Error(updateResult.message)
      }
      toast({
        title: "Spec Saved",
        description: "Your specification has been saved."
      })
      setIsEditing(false)
    } catch (error: any) {
      console.error("Error saving spec:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to save spec",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  /**
   * Copies the spec text to the user's clipboard.
   */
  function handleCopySpec() {
    if (!spec) return
    navigator.clipboard.writeText(spec)
    toast({
      title: "Spec Copied",
      description: "The specification has been copied to your clipboard."
    })
  }

  return (
    <div className="mx-auto flex h-full grow flex-col space-y-4 p-4">
      <StageHeader
        title="Specification"
        description="Define the detailed specification for your project."
        icon={FileText}
        nextButton={
          <Link href={`/project/${chatId}/plan`}>
            <Button variant="default">Next: Planner</Button>
          </Link>
        }
      >
        <span className="flex gap-2">
          <GenerateModalButton
            variant="outline"
            label="Generate Spec"
            promptType="spec"
            projectId={chatId}
          />
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false)
                  setSpec(initialSpec)
                }}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleSaveSpec}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
              <Button variant="outline" onClick={handleCopySpec}>
                Copy to Clipboard
              </Button>
            </>
          )}
        </span>
      </StageHeader>

      <div className="flex grow flex-col gap-2">
        {isEditing ? (
          <Textarea
            id="spec-editor"
            className="h-full min-h-[300px] resize-none"
            value={spec}
            onChange={e => setSpec(e.target.value)}
          />
        ) : (
          <div className="prose prose-sm dark:prose-invert bg-muted h-full max-w-none overflow-auto rounded-md border p-4">
            <ReactMarkdown>{spec}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  )
}
