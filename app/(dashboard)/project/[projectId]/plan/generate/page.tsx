"use server"
import { Suspense } from "react"
import { redirect, notFound } from "next/navigation"
// import { generateImplementationPlanAction } from "@/actions/ai/ai-actions"
import { getProjectByIdAction } from "@/actions/db/projects-actions"
import { Skeleton } from "@/components/ui/skeleton"

interface GeneratePlanPageProps {
  params: {
    projectId: string
  }
}

export default async function GeneratePlanPage({
  params
}: GeneratePlanPageProps) {
  return (
    <Suspense fallback={<PlanGeneratingFallback />}>
      <GeneratePlanFetcher projectId={params.projectId} />
    </Suspense>
  )
}

async function GeneratePlanFetcher({
  projectId
}: {
  projectId: string
}): Promise<never> {
  // Validate the session
  const sessionRes = await getProjectByIdAction(projectId)
  if (!sessionRes.isSuccess || !sessionRes.data) {
    notFound()
  }

  // TODO: Reimplement
  // // Generate the plan
  // const planRes = await generateImplementationPlanAction(projectId)
  // if (!planRes.isSuccess) {
  //   throw new Error(planRes.message || "Failed to generate plan.")
  // }

  // Once complete, go back to the plan page
  redirect(`/project/${projectId}/plan`)
}

function PlanGeneratingFallback() {
  return (
    <div className="mx-auto max-w-md p-4 text-center">
      <h2 className="mb-4 text-xl font-semibold">Generating your plan...</h2>
      <Skeleton className="mb-2 h-4 w-full" />
      <Skeleton className="mb-2 h-4 w-3/4" />
      <Skeleton className="mb-2 h-4 w-1/2" />
    </div>
  )
}
