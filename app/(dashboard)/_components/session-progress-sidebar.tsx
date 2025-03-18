/*
<ai_context>
A collapsible sidebar component that shows progress through the SpecLoop workflow steps.
</ai_context>
<recent_changes>
Updated to use shadcn/ui sidebar components for better structure and consistency.
*/

"use client"

import React from "react"
import { cn } from "@/lib/utils"
import {
  Check,
  MessageSquare,
  Lightbulb,
  FileText,
  Code,
  ListTodo,
  Cpu,
  Layers,
  Home
} from "lucide-react"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
import {
  useSidebar,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar"

/**
 * CompletedSteps interface
 * Each step is represented by a boolean indicating if it's completed or not.
 */
export interface CompletedSteps {
  idea_chat: boolean
  idea_request: boolean
  rules: boolean
  template: boolean
  spec: boolean
  plan: boolean
  codegen: boolean
}

/**
 * SessionProgressSidebarProps
 * completedSteps: CompletedSteps object
 * sessionName: string
 */
export interface SessionProgressSidebarProps {
  completedSteps: CompletedSteps
  sessionName: string
}

/**
 * A small internal structure to define our step labels, routes, and icons
 */
const stepsData = [
  {
    label: "Idea Chat",
    key: "idea_chat",
    route: "idea_chat",
    icon: MessageSquare
  },
  {
    label: "Project Request",
    key: "idea_request",
    route: "idea_request",
    icon: Lightbulb
  },
  {
    label: "Project Rules",
    key: "rules",
    route: "rules",
    icon: FileText
  },
  {
    label: "Starter Template",
    key: "template",
    route: "template",
    icon: Layers
  },
  {
    label: "Specification",
    key: "spec",
    route: "spec",
    icon: FileText
  },
  {
    label: "Planner",
    key: "plan",
    route: "plan",
    icon: ListTodo
  },
  {
    label: "Codegen",
    key: "codegen",
    route: "codegen",
    icon: Cpu
  }
]

/**
 * SessionProgressSidebar
 * Renders a list of steps with a highlight on the active step
 * and a check mark if that step is completed.
 * Now with collapsible functionality and icons.
 */
export default function SessionProgressSidebar({
  completedSteps,
  sessionName
}: SessionProgressSidebarProps) {
  const { projectId } = useParams()
  const pathname = usePathname()
  const pathParts = pathname.split("/")
  const currentFolder = pathParts[3] || ""
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  // Find the active step by matching the current route
  const activeStepIndex = stepsData.findIndex(step => {
    // Check if the current path starts with this step's route
    return currentFolder === step.route
  })

  const activeStep = activeStepIndex !== -1 ? activeStepIndex + 1 : 1

  return (
    <>
      <SidebarGroup className="mt-4">
        <SidebarGroupLabel
          className={cn(
            "text-muted-foreground font-bold uppercase tracking-wide",
            isCollapsed ? "flex justify-center text-xs" : "text-sm"
          )}
        >
          {!isCollapsed && sessionName}
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {stepsData.map((step, index) => {
              const stepNumber = index + 1
              const isActive = stepNumber === activeStep
              const isCompleted = Boolean(
                completedSteps[step.key as keyof CompletedSteps]
              )
              const Icon = step.icon

              return (
                <SidebarMenuItem key={step.label}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    title={isCollapsed ? step.label : undefined}
                  >
                    <Link
                      href={`/project/${projectId}/${step.route}`}
                      className="flex items-center gap-2"
                    >
                      {isCollapsed ? (
                        <div className="relative flex justify-center">
                          <Icon className="size-5" />
                          {isCompleted && (
                            <Check className="absolute -bottom-1 -right-1 size-2.5 rounded-full" />
                          )}
                          {/* {isCompleted && (
                            <div className="absolute -bottom-1 -right-1 size-2.5 rounded-full bg-green-500" />
                          )} */}
                        </div>
                      ) : (
                        <>
                          <Icon className="size-4 shrink-0" />
                          <span className="truncate">
                            <span className="mr-1 font-medium">
                              {stepNumber}.
                            </span>
                            {step.label}
                          </span>
                          {isCompleted && (
                            <Check className="ml-auto size-4 shrink-0" />
                          )}
                        </>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  )
}
