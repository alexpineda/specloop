"use client"
/**
 * @file planner-stage.tsx
 * @description
 * A client component for the "Planner Stage" in the Specloop workflow.
 * This updated version allows the user to view the plan as text or as a list of tasks.
 * The user can edit the plan text directly or check off tasks and update the plan text accordingly.
 *
 * Key changes:
 * - Removed tabs in favor of an edit button approach
 * - Maintains the ability to view tasks and check them off
 * - Toggles between viewing (with tasks) and editing modes
 *
 * @dependencies
 * - updateChatSessionAction for saving the plan
 * - next/navigation for routing
 * - toast for notifications
 * - PlanTasks from ./plan-tasks
 *
 * @notes
 * - Still ephemeral for tasks. We do not store tasks in DB individually.
 * - The user can see bullet lines like "- something" to treat them as tasks.
 * - Tasks can be expanded individually to show details.
 */

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "@/lib/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { updateProjectAction } from "@/actions/db/projects-actions"
import PlanTasks from "./plan-tasks"
import Link from "next/link"
import { StageHeader } from "@/components/stage/stage-header"
import { GenerateModalButton } from "@/components/generate-modal-button"
import { ListTodo } from "lucide-react"

interface PlannerStageProps {
  projectId: string
  initialPlan: string
}

/**
 * PlannerStage
 * ------------
 * Displays the final plan, allows editing, and includes a task view.
 */
export default function PlannerStage({
  projectId,
  initialPlan
}: PlannerStageProps) {
  const [plan, setPlan] = useState<string>(initialPlan)
  const [isSaving, setIsSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const router = useRouter()

  /**
   * handleSavePlan
   * Saves the plan text to implementationPlan in DB via a server action.
   */
  async function handleSavePlan() {
    try {
      setIsSaving(true)
      const updateRes = await updateProjectAction(projectId, {
        implementationPlan: plan
      })
      if (!updateRes.isSuccess) {
        throw new Error(updateRes.message)
      }
      toast({
        title: "Plan Saved",
        description: "Your plan changes have been saved."
      })
      setIsEditing(false)
    } catch (error: any) {
      console.error("Error saving plan:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to save plan",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  /**
   * handleCopyPlan
   * Copies the plan text to the clipboard.
   */
  function handleCopyPlan() {
    if (!plan) return
    navigator.clipboard.writeText(plan)
    toast({ title: "Copied", description: "Plan content copied to clipboard." })
  }

  /**
   * handlePlanChangeFromTasks
   * Called when PlanTasks user clicks "Apply Changes to Plan," we get the updated text
   * which includes checkboxes (like "- [x] ...") or whatever formatting.
   */
  function handlePlanChangeFromTasks(newPlan: string) {
    setPlan(newPlan)
    toast({
      title: "Task Changes Applied",
      description: "Your plan text was updated from the task view."
    })
  }

  return (
    <div className="mx-auto w-full max-w-4xl p-4">
      <StageHeader
        title="Implementation Plan"
        description="Define the implementation plan for your project."
        icon={ListTodo}
        nextButton={
          <Link href={`/project/${projectId}/codegen`}>
            <Button variant="default">Next: Codegen</Button>
          </Link>
        }
      >
        <span className="flex gap-2">
          <GenerateModalButton
            variant="outline"
            label="Generate Plan"
            promptType="implementationPlan"
            projectId={projectId}
          />
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false)
                  setPlan(initialPlan)
                }}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleSavePlan}
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
              <Button variant="outline" onClick={handleCopyPlan}>
                Copy to Clipboard
              </Button>
            </>
          )}
        </span>
      </StageHeader>

      {/* Plan content area */}
      <div className="mt-6 flex flex-col gap-4">
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label
                className="mb-1 block text-sm font-semibold"
                htmlFor="planner-editor"
              >
                Implementation Plan (Markdown or Text)
              </label>
              <Textarea
                id="planner-editor"
                className="h-80"
                value={plan}
                onChange={e => setPlan(e.target.value)}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <PlanTasks
              planText={plan}
              onPlanChange={handlePlanChangeFromTasks}
            />
          </div>
        )}
      </div>
    </div>
  )
}
