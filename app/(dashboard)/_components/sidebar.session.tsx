"use client"

import React, { useEffect, useState } from "react"
import { getStepStatusesAction } from "@/actions/db/projects-actions"
import SessionProgressSidebar, {
  CompletedSteps
} from "./session-progress-sidebar"
import { useParams } from "next/navigation"

export default function SidebarSession() {
  const params = useParams()
  const projectId = params?.projectId as string | undefined

  const [completedSteps, setCompletedSteps] = useState<CompletedSteps>({
    idea_chat: false,
    idea_request: false,
    rules: false,
    template: false,
    spec: false,
    plan: false,
    codegen: false
  })
  const [sessionName, setSessionName] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!projectId) {
      setIsLoading(false)
      return
    }

    const fetchStepStatuses = async () => {
      try {
        const statusesRes = await getStepStatusesAction(projectId)
        if (!statusesRes.isSuccess) {
          throw new Error(statusesRes.message || "Failed to get step statuses.")
        }

        setCompletedSteps(statusesRes.data.completedSteps)
        setSessionName(statusesRes.data.sessionName)
        setIsLoading(false)
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        )
        setIsLoading(false)
      }
    }

    fetchStepStatuses()
  }, [projectId])

  if (!projectId) {
    return null
  }

  if (isLoading) {
    return <div className="p-4">Loading session progress...</div>
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>
  }

  return (
    <SessionProgressSidebar
      completedSteps={completedSteps}
      sessionName={sessionName}
    />
  )
}
