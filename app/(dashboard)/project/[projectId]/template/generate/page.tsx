"use server"
import { Suspense } from "react"
import { redirect, notFound } from "next/navigation"
import { getProjectByIdAction } from "@/actions/db/projects-actions"
import { Skeleton } from "@/components/ui/skeleton"

interface GenerateTemplatePageProps {
  params: {
    projectId: string
  }
}

export default async function GenerateTemplatePage({
  params
}: GenerateTemplatePageProps) {
  return (
    <Suspense fallback={<TemplateGeneratingFallback />}>
      <GenerateTemplateFetcher projectId={params.projectId} />
    </Suspense>
  )
}

async function GenerateTemplateFetcher({
  projectId
}: {
  projectId: string
}): Promise<never> {
  // Validate the session
  const sessionRes = await getProjectByIdAction(projectId)
  if (!sessionRes.isSuccess || !sessionRes.data) {
    notFound()
  }

  // TODO: Implement template generation
  // const templateRes = await generateTemplateAction(projectId)
  // if (!templateRes.isSuccess) {
  //   throw new Error(templateRes.message || "Failed to generate template.")
  // }

  // Once complete, go back to the template page
  redirect(`/project/${projectId}/template`)
}

function TemplateGeneratingFallback() {
  return (
    <div className="mx-auto max-w-md p-4 text-center">
      <h2 className="mb-4 text-xl font-semibold">
        Generating your template...
      </h2>
      <Skeleton className="mb-2 h-4 w-full" />
      <Skeleton className="mb-2 h-4 w-3/4" />
      <Skeleton className="mb-2 h-4 w-1/2" />
    </div>
  )
}
