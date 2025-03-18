"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/lib/hooks/use-toast"
import { updateProjectAction } from "@/actions/db/projects-actions"
// import { generateProjectRulesAI } from "@/actions/ai/ai-actions"
import { GenerateModalButton } from "@/components/generate-modal-button"
import ReactMarkdown from "react-markdown"
import { StageHeader } from "@/components/stage/stage-header"
import Link from "next/link"
import { FileText } from "lucide-react"

interface RulesStageProps {
  /**
   * The session ID so we can update the DB row.
   */
  projectId: string

  /**
   * Existing (or empty) initial content for projectRules
   */
  initialProjectRules: string
}

export default function RulesStage({
  projectId,
  initialProjectRules
}: RulesStageProps) {
  const [projectRules, setProjectRules] = useState(initialProjectRules)
  const [isSaving, setIsSaving] = useState(false)
  const [isGeneratingRules, setIsGeneratingRules] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const router = useRouter()

  /**
   * handleSave
   * ----------
   * Saves the current projectRules to the database
   * without navigating away from the current page.
   */
  async function handleSave() {
    try {
      setIsSaving(true)
      const res = await updateProjectAction(projectId, {
        projectRules
      })
      if (!res.isSuccess) {
        throw new Error(res.message)
      }

      toast({
        title: "Saved",
        description: "Project rules saved successfully"
      })
      setIsEditing(false)
      router.refresh()
    } catch (error: any) {
      console.error("Error saving rules:", error)
      toast({
        title: "Save Error",
        description: error.message || "Failed to save the rules data",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  /**
   * handleNext
   * ----------
   * Saves projectRules to the DB, then navigates
   * to the template route.
   */
  async function handleNext() {
    try {
      setIsSaving(true)
      const res = await updateProjectAction(projectId, {
        projectRules
      })
      if (!res.isSuccess) {
        throw new Error(res.message)
      }

      router.push(`/project/${projectId}/template`)
    } catch (error: any) {
      console.error("Error updating chat session with rules:", error)
      toast({
        title: "Save Error",
        description: error.message || "Failed to save the rules data",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  // TODO: Reimplement
  // async function handleGenerateRules() {
  //   if (isGeneratingRules) return

  //   try {
  //     setIsGeneratingRules(true)
  //     // TODO: Reimplement
  //     // const res = await generateProjectRulesAI(projectId)
  //     // if (!res.isSuccess) {
  //     //   throw new Error(res.message)
  //     // }
  //     // setProjectRules(res.data)
  //     toast({
  //       title: "Success",
  //       description: "Project rules generated successfully"
  //     })
  //     setIsGeneratingRules(false)
  //   } catch (error: any) {
  //     console.error("Error generating rules:", error)
  //     toast({
  //       title: "Generation Error",
  //       description: error.message || "Failed to generate project rules",
  //       variant: "destructive"
  //     })
  //   } finally {
  //     setIsGeneratingRules(false)
  //   }
  // }

  return (
    <div className="mx-auto w-full space-y-6 p-4">
      <StageHeader
        title="Project Rules"
        description="Define the rules and constraints for your project. Consider these as conventions or what you would place in .cursorrules. These will guide the AI in generating appropriate code and specifications."
        icon={FileText}
        nextButton={
          <Link href={`/project/${projectId}/template`}>
            <Button>Next: Template</Button>
          </Link>
        }
      >
        <span className="flex gap-2">
          <GenerateModalButton
            label="Generate Rules"
            projectId={projectId}
            promptType="rules"
            variant="outline"
            warning="It's best if you use a real example of a .cursorrules file rather than using this prompt!"
          />
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false)
                  setProjectRules(initialProjectRules)
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
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
            </>
          )}
        </span>
      </StageHeader>

      {isEditing ? (
        <Textarea
          id="rules"
          placeholder='e.g., "Use only functional components and Tailwind CSS"; "Integrate with x service"'
          value={projectRules}
          onChange={e => setProjectRules(e.target.value)}
          className="min-h-[calc(100vh-250px)] w-full resize-none font-mono text-sm"
        />
      ) : (
        <div className="prose prose-sm dark:prose-invert bg-muted h-full max-w-none overflow-auto rounded-md border p-4">
          <ReactMarkdown>{projectRules}</ReactMarkdown>
        </div>
      )}
    </div>
  )
}
