"use server"

import { db } from "@/db/db"
import {
  projectsTable,
  InsertProject,
  SelectProject
} from "@/db/schema/projects-schema"
import { eq } from "drizzle-orm"
import { ActionState } from "@/types"
import {
  respondToUserChatMessageAction,
  generateSessionNameAI
  // generateIdeaFromSpecAI
} from "../ai/ai-actions"
import { completeStep } from "@/lib/utils/plan-utils"
import { getMessagesByChatIdAction } from "./messages-actions"
import { CompletedSteps } from "@/app/(dashboard)/_components/session-progress-sidebar"
import { getRawPromptAction } from "./settings-actions"

export async function createProjectAction(): Promise<
  ActionState<SelectProject>
> {
  try {
    const newSessionData: InsertProject = {}
    const [createdSession] = await db
      .insert(projectsTable)
      .values(newSessionData)
      .returning()

    return {
      isSuccess: true,
      message: "Chat session created successfully",
      data: createdSession
    }
  } catch (error) {
    console.error("Error creating chat session:", error)
    return {
      isSuccess: false,
      message: "Failed to create chat session"
    }
  }
}

export async function getProjectsAction(): Promise<
  ActionState<SelectProject[]>
> {
  try {
    const sessions = await db.query.projects.findMany({
      orderBy: (table, { desc }) => [desc(table.updatedAt)]
    })

    return {
      isSuccess: true,
      message: "Projects retrieved successfully",
      data: sessions
    }
  } catch (error) {
    console.error("Error retrieving projects:", error)
    return {
      isSuccess: false,
      message: "Failed to retrieve projects"
    }
  }
}

export async function getProjectByIdAction(
  projectId: string
): Promise<ActionState<SelectProject>> {
  try {
    const session = await db.query.projects.findFirst({
      where: eq(projectsTable.id, projectId)
    })

    if (!session) {
      return {
        isSuccess: false,
        message: "Project not found"
      }
    }

    return {
      isSuccess: true,
      message: "Project retrieved successfully",
      data: session
    }
  } catch (error) {
    console.error("Error retrieving project by ID:", error)
    return {
      isSuccess: false,
      message: "Failed to retrieve project"
    }
  }
}

export async function updateProjectAction(
  projectId: string,
  data: Partial<InsertProject>
): Promise<ActionState<SelectProject>> {
  try {
    const [updatedSession] = await db
      .update(projectsTable)
      .set(data)
      .where(eq(projectsTable.id, projectId))
      .returning()

    if (!updatedSession) {
      return {
        isSuccess: false,
        message: "Project not found to update"
      }
    }

    return {
      isSuccess: true,
      message: "Project updated successfully",
      data: updatedSession
    }
  } catch (error) {
    console.error("Error updating chat session:", error)
    return {
      isSuccess: false,
      message: "Failed to update chat session"
    }
  }
}

export async function deleteProjectAction(
  projectId: string
): Promise<ActionState<void>> {
  try {
    await db.delete(projectsTable).where(eq(projectsTable.id, projectId))
    return {
      isSuccess: true,
      message: "Project deleted successfully",
      data: undefined
    }
  } catch (error) {
    console.error("Error deleting project:", error)
    return {
      isSuccess: false,
      message: "Failed to delete project"
    }
  }
}

export async function createNewProjectWithIdeaAction(
  idea: string
): Promise<ActionState<string>> {
  try {
    // 1. Generate a name for the session based on the idea
    const nameResult = await generateSessionNameAI(idea)
    if (!nameResult.isSuccess) {
      throw new Error("Failed to generate project name")
    }

    // 2. Create a new chat session with the generated name
    const sessionInsert: InsertProject = {
      name: nameResult.data.name,
      projectShortSummary: nameResult.data.shortDescription
    }
    const [session] = await db
      .insert(projectsTable)
      .values(sessionInsert)
      .returning()

    const requestPrompt = await getRawPromptAction("projectRequest")
    if (!requestPrompt.isSuccess) {
      throw new Error("Failed to get project request prompt")
    }
    // 3. Build the user's first message from request_prompt.md
    const userMessage = requestPrompt.data.replace("{{IDEA}}", idea)

    // 4. Insert the user's message and get AI response
    const result = await respondToUserChatMessageAction({
      chatId: session.id,
      userContent: userMessage
    })

    if (!result.isSuccess) {
      throw new Error("Failed to process initial message")
    }

    return {
      isSuccess: true,
      message: "Project created successfully",
      data: session.id
    }
  } catch (error) {
    console.error("Error creating project with idea:", error)
    return {
      isSuccess: false,
      message: "Failed to create project"
    }
  }
}

export async function updateExistingCodeAction(
  projectId: string,
  code: string
): Promise<ActionState<SelectProject>> {
  try {
    const [updated] = await db
      .update(projectsTable)
      .set({ existingCode: code })
      .where(eq(projectsTable.id, projectId))
      .returning()

    if (!updated) {
      return {
        isSuccess: false,
        message: "Chat session not found or could not be updated"
      }
    }

    return {
      isSuccess: true,
      message: "Chat session code updated successfully",
      data: updated
    }
  } catch (error) {
    console.error("Error updating existing code:", error)
    return {
      isSuccess: false,
      message: "Failed to update existing code snippet"
    }
  }
}

export async function markStepCompleteAction(
  projectId: string,
  stepNumber: number
): Promise<ActionState<SelectProject>> {
  try {
    const session = await db.query.projects.findFirst({
      where: eq(projectsTable.id, projectId)
    })

    if (!session) {
      return {
        isSuccess: false,
        message: "Project not found"
      }
    }

    if (!session.implementationPlan) {
      return {
        isSuccess: false,
        message: "No implementation plan found"
      }
    }

    // Use the completeStep utility to update the plan text
    const updatedPlan = completeStep(session.implementationPlan, stepNumber)

    const [updatedSession] = await db
      .update(projectsTable)
      .set({
        implementationPlan: updatedPlan,
        lastGeneratedCode: null // Clear the last generated code
      })
      .where(eq(projectsTable.id, projectId))
      .returning()

    return {
      isSuccess: true,
      message: "Step marked as complete",
      data: updatedSession
    }
  } catch (error) {
    console.error("Error marking step as complete:", error)
    return {
      isSuccess: false,
      message: "Failed to mark step as complete"
    }
  }
}

// export async function createNewProjectFromExistingSpec(
//   spec: string
// ): Promise<ActionState<string>> {
//   try {
//     // 1. Generate an idea from the spec
//     const ideaResult = await generateIdeaFromSpecAI(spec)
//     if (!ideaResult.isSuccess) {
//       throw new Error("Failed to generate idea from spec")
//     }

//     // 2. Generate a name for the session based on the idea
//     const nameResult = await generateSessionNameAI(ideaResult.data)
//     if (!nameResult.isSuccess) {
//       throw new Error("Failed to generate session name")
//     }

//     // 3. Create a new chat session with the generated name, idea, and spec
//     const sessionInsert: InsertProject = {
//       name: nameResult.data.name,
//       projectShortSummary: nameResult.data.shortDescription,
//       ideaRequest: ideaResult.data,
//       spec: spec
//     }

//     const [session] = await db
//       .insert(projectsTable)
//       .values(sessionInsert)
//       .returning()

//     return {
//       isSuccess: true,
//       message: "Chat session created successfully from spec",
//       data: session.id
//     }
//   } catch (error) {
//     console.error("Error creating chat session from spec:", error)
//     return {
//       isSuccess: false,
//       message: "Failed to create chat session from spec"
//     }
//   }
// }

export async function getStepStatusesAction(
  projectId: string
): Promise<
  ActionState<{ completedSteps: CompletedSteps; sessionName: string }>
> {
  try {
    // Validate the session
    const sessionRes = await getProjectByIdAction(projectId)
    if (!sessionRes.isSuccess || !sessionRes.data) {
      return {
        isSuccess: false,
        message: sessionRes.message || "Session not found."
      }
    }
    const session = sessionRes.data

    // Fetch messages
    const messagesRes = await getMessagesByChatIdAction(projectId)
    if (!messagesRes.isSuccess) {
      return {
        isSuccess: false,
        message: messagesRes.message || "Failed to fetch messages."
      }
    }
    const messages = messagesRes.data

    // Determine which steps are completed
    const completed: CompletedSteps = {
      idea_chat: false,
      idea_request: false,
      rules: false,
      template: false,
      spec: false,
      plan: false,
      codegen: false
    }

    if (messages.length > 0) {
      completed.idea_chat = true
    }

    if (session.ideaRequest && session.ideaRequest.trim().length > 0) {
      completed.idea_request = true
    }

    if (session.spec && session.spec.trim().length > 0) {
      completed.spec = true
    }

    if (
      session.implementationPlan &&
      session.implementationPlan.trim().length > 0
    ) {
      completed.plan = true
    }

    if (
      session.lastGeneratedCode &&
      session.lastGeneratedCode.trim().length > 0
    ) {
      completed.codegen = true
    }

    if (session.projectRules && session.projectRules.trim().length > 0) {
      completed.rules = true
    }

    if (session.starterTemplate && session.starterTemplate.trim().length > 0) {
      completed.template = true
    }

    return {
      isSuccess: true,
      message: "Step statuses retrieved successfully",
      data: {
        completedSteps: completed,
        sessionName: session.name || "Untitled Session"
      }
    }
  } catch (error) {
    console.error("Error retrieving step statuses:", error)
    return {
      isSuccess: false,
      message: "Failed to retrieve step statuses"
    }
  }
}

export async function updateAdditionalDocumentsAction(
  projectId: string,
  additionalDocuments: string
): Promise<ActionState<SelectProject>> {
  try {
    const [updatedProject] = await db
      .update(projectsTable)
      .set({
        additionalDocuments,
        updatedAt: new Date()
      })
      .where(eq(projectsTable.id, projectId))
      .returning()

    return {
      isSuccess: true,
      message: "Additional documents updated successfully",
      data: updatedProject
    }
  } catch (error) {
    console.error("Error updating additional documents:", error)
    return {
      isSuccess: false,
      message: "Failed to update additional documents"
    }
  }
}
