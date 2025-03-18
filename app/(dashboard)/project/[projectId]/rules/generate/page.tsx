"use server"
import { Suspense } from "react"
import { redirect, notFound } from "next/navigation"
import { getProjectByIdAction } from "@/actions/db/projects-actions"
import { Skeleton } from "@/components/ui/skeleton"

interface GenerateRulesPageProps {
  params: {
    projectId: string
  }
}

export default async function GenerateRulesPage({
  params
}: GenerateRulesPageProps) {
  return (
    <Suspense fallback={<RulesGeneratingFallback />}>
      <GenerateRulesFetcher projectId={params.projectId} />
    </Suspense>
  )
}

async function GenerateRulesFetcher({
  projectId
}: {
  projectId: string
}): Promise<never> {
  // Validate the session
  const sessionRes = await getProjectByIdAction(projectId)
  if (!sessionRes.isSuccess || !sessionRes.data) {
    notFound()
  }

  // TODO: Implement rules generation
  // const rulesRes = await generateRulesAction(projectId)
  // if (!rulesRes.isSuccess) {
  //   throw new Error(rulesRes.message || "Failed to generate rules.")
  // }

  // Once complete, go back to the rules page
  redirect(`/project/${projectId}/rules`)
}

function RulesGeneratingFallback() {
  return (
    <div className="mx-auto max-w-md p-4 text-center">
      <h2 className="mb-4 text-xl font-semibold">Generating your rules...</h2>
      <Skeleton className="mb-2 h-4 w-full" />
      <Skeleton className="mb-2 h-4 w-3/4" />
      <Skeleton className="mb-2 h-4 w-1/2" />
    </div>
  )
}
