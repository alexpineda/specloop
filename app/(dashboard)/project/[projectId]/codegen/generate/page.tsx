"use server"
/**
 * @file page.tsx
 * @description
 * A dedicated transitional route for generating code. This page shows a "Generating Code..."
 * fallback while calling the server action. Once code is generated, we store the snippet
 * in `chat_sessions_table.lastGeneratedCode` and redirect back to the main codegen page.
 *
 * Step 37: "Show 'Generating Code' Loading State & Task-by-Task Implementation"
 * We provide a transitional experience similar to plan generation.
 *
 * @dependencies
 * - Clerk auth to ensure user is logged in
 * - getChatSessionByIdAction to validate the session
 * - generateCodeForStepAction to call the LLM
 * - updateChatSessionAction to store the snippet
 * - next/navigation for redirect
 * - Suspense for fallback
 */

import { Suspense } from "react"
import { redirect, notFound } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import {
  getProjectByIdAction,
  updateProjectAction
} from "@/actions/db/projects-actions"
import { generateCodeForStepAction } from "@/actions/codegen-actions"

interface GenerateCodePageProps {
  params: Promise<{
    projectId: string
  }>
  /**
   * Next.js automatically parses searchParams from the query string.
   * We'll read `stepIndex` or `stepContent`.
   */
  searchParams: {
    stepIndex?: string
    stepContent?: string
  }
}

export default async function GenerateCodePage({
  params
}: GenerateCodePageProps) {
  return (
    <Suspense fallback={<CodeGeneratingFallback />}>
      <GenerateCodeFetcher projectId={(await params).projectId} />
    </Suspense>
  )
}

async function GenerateCodeFetcher({
  projectId
}: {
  projectId: string
}): Promise<never> {
  // 1) Validate session
  const sessionRes = await getProjectByIdAction(projectId)
  if (!sessionRes.isSuccess || !sessionRes.data) {
    notFound()
  }

  // 2) Parse stepIndex / stepContent from query
  // const stepIndex = searchParams.stepIndex
  //   ? parseInt(searchParams.stepIndex, 10)
  //   : 0
  // 4) Call the code generation action
  const codeRes = await generateCodeForStepAction({
    chatId: projectId
    // stepIndex,
  })
  if (!codeRes.isSuccess) {
    throw new Error(codeRes.message || "Failed to generate code snippet.")
  }

  // 5) Save snippet in DB
  const snippet = codeRes.data.codeSnippet
  const updateRes = await updateProjectAction(projectId, {
    lastGeneratedCode: snippet
  })
  if (!updateRes.isSuccess) {
    throw new Error(updateRes.message || "Failed to store lastGeneratedCode.")
  }

  // 6) Redirect
  redirect(`/project/${projectId}/codegen`)
}

/**
 * CodeGeneratingFallback
 * ----------------------
 * Renders a simple skeleton while code is being generated.
 */
function CodeGeneratingFallback() {
  return (
    <div className="mx-auto max-w-md p-4 text-center">
      <h2 className="mb-4 text-xl font-semibold">Generating code...</h2>
      <Skeleton className="mb-2 h-4 w-3/4" />
      <Skeleton className="mb-2 h-4 w-1/2" />
    </div>
  )
}
