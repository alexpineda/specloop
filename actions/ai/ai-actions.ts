"use server"

import { db } from "@/db/db"
import { messagesTable, InsertMessage } from "@/db/schema/messages-schema"
import { projectsTable } from "@/db/schema/projects-schema"
import { ActionState, Settings } from "@/types"
import { eq } from "drizzle-orm"

import { extractRequestFromChat } from "@/lib/utils/index"
import { z } from "zod"
import {
  getPreparedPromptAction,
  getSettingsAction
} from "../db/settings-actions"
import { getSizedAiClient } from "@/lib/ai/sized-ai-client"
import { generateText, generateObject } from "ai"

interface ProcessChatInput {
  /**
   * The chat session ID to which these messages belong.
   */
  chatId: string

  /**
   * The text content of the user's new message.
   */
  userContent: string
}

export interface ProcessChatOutput {
  assistantMessage: {
    id: string
    chatId: string
    content: string
    role: "assistant" | "user"
    createdAt: string
    updatedAt: string
  }
}

export async function respondToUserChatMessageAction(
  input: ProcessChatInput
): Promise<ActionState<ProcessChatOutput>> {
  try {
    // 1. Insert the user's message into the DB
    const userInsert: InsertMessage = {
      chatId: input.chatId,
      content: input.userContent,
      role: "user"
    }
    await db.insert(messagesTable).values(userInsert)

    const recentMessages = await db.query.messages.findMany({
      where: eq(messagesTable.chatId, input.chatId),
      orderBy: (table, { desc }) => [desc(table.createdAt)]
    })
    const conversationInChronOrder = recentMessages.reverse()

    const [chatClient, model] = await getSizedAiClient("medium")

    const completion = await generateText({
      model: chatClient(model),
      system: `
      You are an assistant that replies in a friendly manner.
      Keep responses short and helpful. 
    `,
      messages: conversationInChronOrder.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    })

    const assistantText =
      completion.text || "Sorry, I couldn't generate a response."

    // 4. Insert assistant's response into DB
    const assistantInsert: InsertMessage = {
      chatId: input.chatId,
      content: assistantText,
      role: "assistant"
    }

    const [assistantMessage] = await db
      .insert(messagesTable)
      .values(assistantInsert)
      .returning()

    // 5. Return success
    return {
      isSuccess: true,
      message: "AI response generated successfully",
      data: {
        assistantMessage: {
          ...assistantMessage,
          createdAt: assistantMessage.createdAt.toISOString(),
          updatedAt: assistantMessage.updatedAt.toISOString()
        }
      }
    }
  } catch (error) {
    console.error("Error in processChatMessageAction:", error)
    return {
      isSuccess: false,
      message: (error as Error).message || "Failed to process chat message"
    }
  }
}

export async function executePromptAction(
  prompt: keyof Settings["prompts"],
  size: keyof Settings["llm"],
  _settings?: Settings
): Promise<ActionState<string>> {
  try {
    let settings = _settings
    if (!_settings) {
      const settingsResult = await getSettingsAction()
      if (!settingsResult.isSuccess) {
        return settingsResult
      }
      settings = settingsResult.data
    }
    const [chatClient, model] = await getSizedAiClient(size, settings)

    const completion = await generateText({
      model: chatClient(model),
      messages: [{ role: "user", content: prompt }]
    })

    return {
      isSuccess: true,
      message: "Prompt executed successfully",
      data: completion.text || "No response from AI"
    }
  } catch (error) {
    console.error("Error in executePromptAction:", error)
    return {
      isSuccess: false,
      message: "Failed to execute prompt"
    }
  }
}

// export const preparePrompt = async (prompt: string, settings: Settings): string => {
//   let preparedPrompt = prompt
//   for (const [key, value] of Object.entries(settings.promptVars)) {
//     preparedPrompt = preparedPrompt.replace(key, value)
//   }
//   return preparedPrompt
// }

// export async function generateSpecAction(
//   chatId: string
// ): Promise<ActionState<{ specContent: string }>> {
//   try {
//     const [session] = await db
//       .select()
//       .from(projectsTable)
//       .where(eq(projectsTable.id, chatId))
//       .limit(1)

//     if (!session) {
//       return {
//         isSuccess: false,
//         message: "Chat session not found."
//       }
//     }
//     const settings = await getSettingsAction()

//     if (!settings.isSuccess) {
//       return settings
//     }

//     const specPrompt = _preparePrompt("spec", settings.data)

//     const chatClient = await getSizedAiClient("large")

//     const completion = await chatClient.message({
//       messages: [
//         {
//           role: "user",
//           content: specPrompt
//         }
//       ]
//     })

//     const specOutput = completion.text || "No specification could be generated."

//     function extractMarkdownContent(text: string): string {
//       const match = text.match(/```markdown\n([\s\S]*?)\n```/)
//       if (!match) {
//         console.error("No match found in extractMarkdownContent")
//         return ""
//       }
//       return match[1]
//     }
//     const parsedSpecOutput = extractMarkdownContent(specOutput)

//     // Return the spec string
//     return {
//       isSuccess: true,
//       message: "Spec generated successfully",
//       data: { specContent: parsedSpecOutput }
//     }
//   } catch (error) {
//     console.error("Error in generateTechSpecAction:", error)
//     return {
//       isSuccess: false,
//       message: "Failed to generate technical specification"
//     }
//   }
// }

// export async function generateImplementationPlanAction(
//   chatId: string
// ): Promise<ActionState<{ planContent: string }>> {
//   try {
//     // Fetch the chat session to get the spec
//     const [session] = await db
//       .select()
//       .from(projectsTable)
//       .where(eq(projectsTable.id, chatId))
//       .limit(1)
//     if (!session) {
//       return {
//         isSuccess: false,
//         message: "Chat session not found."
//       }
//     }
//     if (!session.spec) {
//       return {
//         isSuccess: false,
//         message: "No spec found. Generate a spec before planning."
//       }
//     }

//     const settings = await getSettingsAction()

//     if (!settings.isSuccess) {
//       return settings
//     }

//     const chatClient = new SizedAiClient(settings.data).large

//     const implementationPlanPrompt = _preparePrompt(
//       "implementationPlan",
//       settings.data
//     )

//     const completion = await chatClient.message({
//       system: `
//         You are an expert web application developer.
//         You are given a technical specification and a project request.
//         Your task is to generate a comprehensive, detailed plan for implementing the web application.
//       `,
//       messages: [
//         {
//           role: "user",
//           content: implementationPlanPrompt
//         }
//       ]
//     })

//     const planOutput = completion.text || "No plan could be generated."

//     // We only want what is after </brainstorming>
//     const parsedPlanOutput = planOutput.split("</brainstorming>")[1]

//     await db
//       .update(projectsTable)
//       .set({ implementationPlan: parsedPlanOutput })
//       .where(eq(projectsTable.id, chatId))

//     return {
//       isSuccess: true,
//       message: "Implementation plan generated successfully",
//       data: { planContent: planOutput }
//     }
//   } catch (error) {
//     console.error("Error in generateImplementationPlanAction:", error)
//     return {
//       isSuccess: false,
//       message: "Failed to generate implementation plan"
//     }
//   }
// }

export async function generateSessionNameAI(
  idea: string
): Promise<ActionState<{ name: string; shortDescription: string }>> {
  try {
    const [chatClient, model] = await getSizedAiClient("small")

    const response = await generateObject({
      model: chatClient(model),
      system:
        "You are a helpful assistant that generates concise, memorable names for web app ideas.",
      messages: [
        {
          role: "user",
          content: `
          Generate a concise, memorable name (max 50 chars) for this web app idea: "${idea}".
          Also generate a short description of the web app, max 100 chars, no markdown.
          Return a JSON object with the name and short description.
          `
        }
      ],
      schema: z.object({
        name: z.string().describe("The generated name for the web app"),
        shortDescription: z
          .string()
          .describe(
            "A short description of the web app, max 100 chars, no markdown"
          )
      })
    })

    if (!response.object) {
      throw new Error("No name generated")
    }

    return {
      isSuccess: true,
      message: "Session name generated successfully",
      data: response.object
    }
  } catch (error) {
    console.error("Error generating session name:", error)
    return {
      isSuccess: false,
      message: "Failed to generate session name"
    }
  }
}

// export async function generateProjectRulesAI(
//   chatId: string
// ): Promise<ActionState<string>> {
//   try {
//     const settings = await getSettingsAction()

//     if (!settings.isSuccess) {
//       return settings
//     }

//     const chatClient = await getSizedAiClient("large", settings.data)

//     const projectRulesPrompt = await getPreparedPromptAction(
//       "rules",
//       settings.data
//     )

//     // Get the chat session to access messages
//     const [session] = await db
//       .select()
//       .from(projectsTable)
//       .where(eq(projectsTable.id, chatId))
//       .limit(1)

//     if (!session) {
//       return {
//         isSuccess: false,
//         message: "Chat session not found."
//       }
//     }

//     const response = await chatClient.message({
//       system: `You are an expert web application architect.`,
//       messages: [
//         {
//           role: "user",
//           content: projectRulesPrompt
//         }
//       ]
//     })

//     if (!response.text) {
//       throw new Error("No rules generated")
//     }

//     // Save the generated rules to the database
//     await db
//       .update(projectsTable)
//       .set({ projectRules: response.text.trim() })
//       .where(eq(projectsTable.id, chatId))

//     return {
//       isSuccess: true,
//       message: "Project rules generated successfully",
//       data: response.text.trim()
//     }
//   } catch (error) {
//     console.error("Error generating project rules:", error)
//     return {
//       isSuccess: false,
//       message: "Failed to generate project rules"
//     }
//   }
// }

// export async function generateStarterTemplateAI(
//   chatId: string
// ): Promise<ActionState<string>> {
//   try {
//     const settings = await getSettingsAction()

//     if (!settings.isSuccess) {
//       return settings
//     }

//     const chatClient = await getSizedAiClient("large", settings.data)

//     // Get the chat session to access messages
//     const [session] = await db
//       .select()
//       .from(projectsTable)
//       .where(eq(projectsTable.id, chatId))
//       .limit(1)

//     if (!session) {
//       return {
//         isSuccess: false,
//         message: "Chat session not found."
//       }
//     }

//     // Include project rules in prompt if they exist
//     const projectRulesText = session.projectRules
//       ? `\n\nProject Rules:\n${session.projectRules}`
//       : ""

//     const response = await chatClient.message({
//       system: `You are an expert web application developer.`,
//       messages: [
//         {
//           role: "user",
//           content: codeTemplatePrompt
//             .replace("{{PROJECT_REQUEST}}", session.ideaRequest || "")
//             .replace("{{PROJECT_RULES}}", projectRulesText)
//         }
//       ]
//     })

//     if (!response.text) {
//       throw new Error("No template generated")
//     }

//     // Save the generated template to the database
//     await db
//       .update(projectsTable)
//       .set({ starterTemplate: response.text.trim() })
//       .where(eq(projectsTable.id, chatId))

//     return {
//       isSuccess: true,
//       message: "Starter template generated successfully",
//       data: response.text.trim()
//     }
//   } catch (error) {
//     console.error("Error generating starter template:", error)
//     return {
//       isSuccess: false,
//       message: "Failed to generate starter template"
//     }
//   }
// }

// export async function generateIdeaFromSpecAI(
//   spec: string
// ): Promise<ActionState<string>> {
//   try {
//     const chatClient = await getSizedAiClient("medium")

//     const response = await chatClient.message({
//       system:
//         "You are an expert at extracting project ideas from technical specifications. Your task is to create a clear, concise project request based on a technical specification.",
//       messages: [
//         {
//           role: "user",
//           content: `Given this technical specification, create a clear, concise project request that captures the key points and requirements. Format it according to the template below:

// Technical Specification:
// ${spec}

// Please format your response as:

// <request>
// # Project Name

// ## Project Description

// [Description]

// ## Target Audience

// [Target users]

// ## Desired Features

// ### [Feature Category]

// - [ ] [Requirement]
//   - [ ] [Sub-requirement]

// ## Design Requests

// - [ ] [Design requirement]
//   - [ ] [Design detail]

// ## Other Notes

// - [Additional considerations]
// </request>

// Focus on extracting the core idea, key features, and requirements from the specification.`
//         }
//       ]
//     })

//     if (!response.text) {
//       throw new Error("No idea generated from spec")
//     }

//     const idea = extractRequestFromChat(response.text)

//     if (!idea) {
//       throw new Error("No idea generated from spec")
//     }

//     return {
//       isSuccess: true,
//       message: "Idea generated from spec successfully",
//       data: idea
//     }
//   } catch (error) {
//     console.error("Error generating idea from spec:", error)
//     return {
//       isSuccess: false,
//       message: "Failed to generate idea from spec"
//     }
//   }
// }
