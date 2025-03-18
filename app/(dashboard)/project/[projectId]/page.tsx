"use server"
import { redirect } from "next/navigation"
import { getProjectByIdAction } from "@/actions/db/projects-actions"

interface ChatPageProps {
  params: {
    projectId: string
  }
}

export default async function ChatPage({ params }: ChatPageProps) {
  const sessionRes = await getProjectByIdAction(params.projectId)

  if (sessionRes.isSuccess && sessionRes.data?.implementationPlan) {
    return redirect(`/project/${params.projectId}/codegen`)
  }

  if (sessionRes.isSuccess && sessionRes.data?.spec) {
    return redirect(`/project/${params.projectId}/plan`)
  }

  return redirect(`/project/${params.projectId}/idea_chat`)
}
