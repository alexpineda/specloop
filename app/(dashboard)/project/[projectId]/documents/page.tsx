"use server"

import { getProjectByIdAction } from "@/actions/db/projects-actions"
import DocumentsClient from "./_components/documents-client"

interface DocumentsPageProps {
  params: {
    projectId: string
  }
}

export default async function DocumentsPage({ params }: DocumentsPageProps) {
  const { data: project } = await getProjectByIdAction(params.projectId)

  if (!project) {
    return <div>Project not found</div>
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">Additional Documents</h1>
      <p className="text-muted-foreground">
        Paste any additional documents or context that you want to include in
        your project.
      </p>
      <DocumentsClient
        projectId={project.id}
        initialDocuments={project.additionalDocuments || ""}
      />
    </div>
  )
}
