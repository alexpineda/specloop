"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import ReactMarkdown from "react-markdown"
import {
  extractImplementationSteps,
  ImplementationStep,
  deleteStep
} from "@/lib/utils/plan-utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  MoreHorizontal,
  Check,
  Trash,
  ArrowRight,
  Copy,
  ChevronDown,
  ChevronRight
} from "lucide-react"
import { markStepCompleteAction } from "@/actions/db/projects-actions"
import { useParams } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

/**
 * Props for the PlanTasks component
 */
interface PlanTasksProps {
  /**
   * The current plan text (raw).
   */
  planText: string
  /**
   * Callback when we want to push the updated plan text back to the parent
   */
  onPlanChange: (newPlan: string) => void
}

/**
 * PlanTasks
 * ---------
 * Parses the plan text into a list of bullet tasks. We allow the user to
 * toggle checkboxes. If they click "Apply Changes to Plan," we produce
 * a new plan string with the tasks replaced by "[x]" or similar markers.
 */
export default function PlanTasks({ planText, onPlanChange }: PlanTasksProps) {
  const [tasks, setTasks] = useState<ImplementationStep[]>([])
  const [lastCompletedId, setLastCompletedId] = useState<number | null>(null)
  const [expandedTaskId, setExpandedTaskId] = useState<number | null>(null)
  const { projectId } = useParams<{ projectId: string }>()
  const { toast } = useToast()

  // Parse tasks when component mounts or planText changes
  useEffect(() => {
    setTasks(extractImplementationSteps(planText))
  }, [planText])

  // Find the next uncompleted task
  const nextTaskId = tasks.find(t => !t.completed)?.id

  /**
   * handleToggleTask
   * Toggles a single task's completed state in local state.
   */
  async function handleToggleTask(id: number) {
    // Update local state first
    setTasks(prev => {
      const newTasks = prev.map(t =>
        t.id === id
          ? {
              ...t,
              completed: !t.completed
            }
          : t
      )
      return newTasks
    })

    // Find the task to check if it was completed
    const task = tasks.find(t => t.id === id)
    const wasJustCompleted = task && !task.completed

    // Update last completed ID if needed
    if (wasJustCompleted) {
      setLastCompletedId(id)

      // If the task was just completed and it's currently expanded, collapse it
      if (expandedTaskId === id) {
        setExpandedTaskId(null)
      }
    } else if (id === lastCompletedId) {
      // Clear last completed if it was unchecked
      setLastCompletedId(null)
    }

    // Call the server action outside of the state updater
    if (wasJustCompleted) {
      try {
        await markStepCompleteAction(projectId, id)
      } catch (error) {
        console.error("Error marking step complete:", error)
        toast({
          title: "Error",
          description: "Failed to mark step as complete on the server",
          variant: "destructive"
        })
      }
    }
  }

  /**
   * handleDeleteTask
   * Deletes a task and updates the plan text
   */
  function handleDeleteTask(id: number) {
    const newPlan = deleteStep(planText, id)
    onPlanChange(newPlan)
    setTasks(prev => prev.filter(t => t.id !== id))

    // Clear expanded task if it was deleted
    if (expandedTaskId === id) {
      setExpandedTaskId(null)
    }
  }

  /**
   * handleCopyTask
   * Copies the task title and details to clipboard
   */
  function handleCopyTask(task: ImplementationStep) {
    const textToCopy = `[${task.id}] ${task.title}${task.details ? `\n\n${task.details}` : ""}`

    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        toast({
          title: "Copied to clipboard",
          description: "Task copied successfully",
          duration: 2000
        })
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

  /**
   * toggleTaskExpansion
   * Expands or collapses a task's details
   */
  function toggleTaskExpansion(id: number) {
    setExpandedTaskId(prev => (prev === id ? null : id))
  }

  // If no tasks found, just show a note
  if (!tasks.length) {
    return (
      <div className="text-muted-foreground my-2 text-sm">
        No bullet-point tasks found. Try adding lines beginning with "- " or "*
        ".
      </div>
    )
  }

  return (
    <div className="mt-4 rounded border p-3">
      <h3 className="mb-2 text-sm font-semibold">Detected Tasks:</h3>
      <div className="space-y-3">
        {tasks.map(task => (
          <div key={task.id} className="space-y-1">
            <div
              className={`group flex items-center gap-2 rounded-sm p-1 text-sm ${
                task.id === nextTaskId
                  ? "border border-blue-500/20 bg-blue-500/10"
                  : "hover:bg-muted/50"
              }`}
            >
              <div className="size-4 shrink-0">
                {task.completed ? (
                  <Check className="size-4 text-green-500" />
                ) : task.id === nextTaskId ? (
                  <ArrowRight className="size-4 animate-pulse text-blue-500" />
                ) : null}
              </div>

              <span
                style={{
                  textDecoration: task.completed ? "line-through" : "none"
                }}
                className="flex-1 cursor-pointer"
                onClick={() => task.details && toggleTaskExpansion(task.id)}
              >
                <span className="text-muted-foreground mr-2">[{task.id}]</span>
                {task.title}
              </span>

              {task.details && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="size-8 p-0"
                  onClick={() => toggleTaskExpansion(task.id)}
                >
                  {expandedTaskId === task.id ? (
                    <ChevronDown className="size-4" />
                  ) : (
                    <ChevronRight className="size-4" />
                  )}
                </Button>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="size-8 p-0">
                    <MoreHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleToggleTask(task.id)}>
                    <Check className="mr-2 size-4" />
                    {task.completed ? "Mark Incomplete" : "Mark Complete"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleCopyTask(task)}>
                    <Copy className="mr-2 size-4" />
                    Copy to Clipboard
                  </DropdownMenuItem>
                  {task.details && (
                    <DropdownMenuItem
                      onClick={() => toggleTaskExpansion(task.id)}
                    >
                      {expandedTaskId === task.id ? (
                        <ChevronDown className="mr-2 size-4" />
                      ) : (
                        <ChevronRight className="mr-2 size-4" />
                      )}
                      {expandedTaskId === task.id
                        ? "Hide Details"
                        : "Show Details"}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={() => handleDeleteTask(task.id)}
                    className="text-destructive"
                  >
                    <Trash className="mr-2 size-4" />
                    Delete Task
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {expandedTaskId === task.id && task.details && (
              <div className="prose prose-sm text-muted-foreground dark:prose-invert bg-muted/30 ml-6 mt-1 rounded-md p-2">
                <ReactMarkdown>{task.details}</ReactMarkdown>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
