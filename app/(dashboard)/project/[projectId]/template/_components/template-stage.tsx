"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { toast } from "@/lib/hooks/use-toast"
import { updateProjectAction } from "@/actions/db/projects-actions"
// import { generateStarterTemplateAI } from "@/actions/ai/ai-actions"
import Editor from "@monaco-editor/react"
import { GenerateModalButton } from "@/components/generate-modal-button"
import Link from "next/link"
import { StageHeader } from "@/components/stage/stage-header"
import { Layers } from "lucide-react"
import { useTheme } from "next-themes"

interface TemplateStageProps {
  /**
   * The session ID so we can update the DB row.
   */
  projectId: string

  /**
   * Existing (or empty) initial content for starterTemplate
   */
  initialStarterTemplate: string
}

export default function TemplateStage({
  projectId,
  initialStarterTemplate
}: TemplateStageProps) {
  const [starterTemplate, setStarterTemplate] = useState(initialStarterTemplate)
  const [isSaving, setIsSaving] = useState(false)
  const [isGeneratingTemplate, setIsGeneratingTemplate] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const { theme } = useTheme()

  const router = useRouter()

  /**
   * handleSave
   * ----------
   * Saves the current starterTemplate to the database
   * without navigating away from the current page.
   */
  async function handleSave() {
    try {
      setIsSaving(true)
      const res = await updateProjectAction(projectId, {
        starterTemplate,
        existingCode: starterTemplate
      })
      if (!res.isSuccess) {
        throw new Error(res.message)
      }

      toast({
        title: "Saved",
        description: "Starter template saved successfully"
      })
      setIsEditing(false)
      router.refresh()
    } catch (error: any) {
      console.error("Error saving template:", error)
      toast({
        title: "Save Error",
        description: error.message || "Failed to save the template data",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  // TODO: Reimplement
  // async function handleGenerateTemplate() {
  //   try {
  //     setIsGeneratingTemplate(true)
  //     // TODO: Reimplement
  //     // const res = await generateStarterTemplateAI(projectId)
  //     // if (!res.isSuccess) {
  //     //   throw new Error(res.message)
  //     // }
  //     // setStarterTemplate(res.data)
  //     toast({
  //       title: "Success",
  //       description: "Starter template generated successfully"
  //     })
  //   } catch (error: any) {
  //     console.error("Error generating template:", error)
  //     toast({
  //       title: "Generation Error",
  //       description: error.message || "Failed to generate starter template",
  //       variant: "destructive"
  //     })
  //   } finally {
  //     setIsGeneratingTemplate(false)
  //   }
  // }

  return (
    <div className="mx-auto w-full space-y-6 p-4">
      <StageHeader
        title="Starter Template"
        description="Define the starter template for your project. This will be used as a starting point for generating the specification."
        icon={Layers}
        nextButton={
          <Link href={`/project/${projectId}/spec`}>
            <Button>Next: Spec</Button>
          </Link>
        }
      >
        <span className="flex gap-2">
          <GenerateModalButton
            label="Generate Template"
            promptType="template"
            projectId={projectId}
            variant="outline"
            warning="It's best if you use a real example of a project rather than using this prompt!"
          />
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false)
                  setStarterTemplate(initialStarterTemplate)
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

      <div className="h-[calc(100vh-250px)]">
        <Editor
          height="100%"
          defaultLanguage="typescript"
          value={starterTemplate}
          theme={theme === "dark" ? "vs-dark" : "light"}
          onChange={value =>
            isEditing ? setStarterTemplate(value || "") : null
          }
          options={{
            minimap: { enabled: true },
            scrollBeyondLastLine: false,
            fontSize: 14,
            wordWrap: "on",
            readOnly: !isEditing
          }}
        />
      </div>
    </div>
  )
}
