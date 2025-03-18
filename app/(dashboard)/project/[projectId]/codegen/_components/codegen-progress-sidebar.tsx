"use client"

import React, { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Check, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
import {
  extractImplementationSteps,
  ImplementationStep
} from "@/lib/utils/plan-utils"
import { getProjectByIdAction } from "@/actions/db/projects-actions"

/**
 * CompletedSteps interface
 * Each step is represented by a boolean indicating if it's completed or not.
 */
export interface CompletedSteps {
  ideation: boolean
  spec: boolean
  plan: boolean
  codegen: boolean
}

/**
 * SessionProgressSidebarProps
 * completedSteps: CompletedSteps object
 */
export interface SessionProgressSidebarProps {
  completedSteps: CompletedSteps
}

/**
 * A small internal structure to define our step labels
 */
const stepsData = [
  { label: "Ideation", key: "ideation" },
  { label: "Specification", key: "spec" },
  { label: "Planner", key: "plan" },
  { label: "Codegen", key: "codegen" }
]

/**
 * CodegenProgressSidebar
 * Renders a list of steps with a highlight on the active step
 * and a check mark if that step is completed. Also shows implementation
 * steps from the plan when in codegen stage.
 */
export default function CodegenProgressSidebar({
  completedSteps
}: SessionProgressSidebarProps) {
  const params = useParams()
  const projectId = params.projectId as string
  const pathname = usePathname()
  const pathParts = pathname.split("/")
  const currentFolder = pathParts[3] || ""
  const activeStep = stepsData.findIndex(step => step.key === currentFolder) + 1
  const [implementationSteps, setImplementationSteps] = useState<
    ImplementationStep[]
  >([])

  // Fetch and parse implementation steps when component mounts
  useEffect(() => {
    if (!projectId) return

    async function fetchPlan() {
      const sessionRes = await getProjectByIdAction(projectId)
      if (sessionRes.isSuccess && sessionRes.data?.implementationPlan) {
        const steps = extractImplementationSteps(
          sessionRes.data.implementationPlan
        )
        setImplementationSteps(steps)
      }
    }
    fetchPlan()
  }, [projectId])

  // Find the next uncompleted task
  const nextTaskId = implementationSteps.find(t => !t.completed)?.id

  return (
    <div className="flex h-full flex-col">
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <Link href={`/`}>
            <h2 className="text-muted-foreground mb-4 text-sm font-bold uppercase tracking-wide">
              Dashboard
            </h2>
          </Link>
        </div>
        <h2 className="text-muted-foreground mb-4 text-sm font-bold uppercase tracking-wide">
          Progress
        </h2>

        <div className="flex flex-col space-y-1">
          {stepsData.map((step, index) => {
            const stepNumber = index + 1
            const isActive = stepNumber === activeStep
            const isCompleted = Boolean(
              completedSteps[step.key as keyof CompletedSteps]
            )

            return (
              <Link href={`/project/${projectId}/${step.key}`} key={step.label}>
                <div
                  className={cn(
                    "flex items-center justify-between rounded p-2 text-sm transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{stepNumber}.</span>
                    <span>{step.label}</span>
                  </div>

                  {isCompleted && (
                    <Check
                      className={
                        isActive
                          ? "size-4 text-white"
                          : "text-foreground size-4 opacity-80 dark:text-white"
                      }
                    />
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Show implementation steps when in codegen stage */}
      {currentFolder === "codegen" && implementationSteps.length > 0 && (
        <div className="flex-1 overflow-auto p-4">
          <h2 className="text-muted-foreground mb-4 text-sm font-bold uppercase tracking-wide">
            Implementation Steps
          </h2>
          <div className="space-y-2">
            {implementationSteps.map(step => (
              <div
                key={step.id}
                className={cn(
                  "flex items-start gap-2 rounded-sm p-2 text-sm",
                  step.id === nextTaskId
                    ? "border border-blue-500/20 bg-blue-500/10"
                    : "hover:bg-muted/50"
                )}
              >
                <div className="mt-0.5 size-4 shrink-0">
                  {step.completed ? (
                    <Check className="size-4 text-green-500" />
                  ) : step.id === nextTaskId ? (
                    <ArrowRight className="size-4 animate-pulse text-blue-500" />
                  ) : null}
                </div>
                <span
                  style={{
                    textDecoration: step.completed ? "line-through" : "none"
                  }}
                  className="flex-1"
                >
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
