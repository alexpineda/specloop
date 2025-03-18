"use server"

import { Suspense } from "react"
import { redirect } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import { getProjectByIdAction } from "@/actions/db/projects-actions"
import CodegenStage from "./_components/codegen-stage"

interface CodegenPageProps {
  params: {
    projectId: string
  }
}

export default async function CodegenPage({ params }: CodegenPageProps) {
  const projectId = params.projectId

  return (
    <Suspense fallback={<CodegenSkeleton />}>
      <CodegenFetcher projectId={projectId} />
    </Suspense>
  )
}

/**
 * CodegenFetcher
 * --------------
 * A server component that fetches the chat session from DB
 * (ensuring it exists), then renders CodegenStage with the relevant data.
 */
async function CodegenFetcher({ projectId }: { projectId: string }) {
  const projectRes = await getProjectByIdAction(projectId)
  if (!projectRes.isSuccess || !projectRes.data) {
    throw new Error(projectRes.message || "Could not retrieve chat session.")
  }

  const project = projectRes.data

  return (
    <CodegenStage
      projectId={project.id}
      lastGeneratedSnippet={project.lastGeneratedCode || ""}
      implementationPlan={project.implementationPlan || ""}
      existingCode={project.existingCode || ""}
    />
  )
}

/**
 * CodegenSkeleton
 * ---------------
 * Displays a simple skeleton loader while data is fetching.
 */
function CodegenSkeleton() {
  return (
    <div className="p-6">
      <Skeleton className="mb-4 h-6 w-2/3" />
      <Skeleton className="mb-2 h-5 w-1/2" />
      <Skeleton className="mb-2 h-5 w-3/4" />
      <Skeleton className="mb-2 h-5 w-1/2" />
    </div>
  )
}
