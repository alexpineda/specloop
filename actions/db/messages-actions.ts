/**
 * @file messages-actions.ts
 * @description
 * Provides server actions for creating, reading, updating, and deleting
 * messages in the "messages" table. Each message references a chat session ID.
 *
 * Key features:
 * - Create messages with role "assistant" or "user"
 * - Retrieve all messages for a given chat session
 * - Update a message's content (if needed)
 * - Delete a message or multiple messages
 *
 * @dependencies
 * - @/db/db: Drizzle instance for database operations
 * - @/db/schema/messages-schema: messagesTable definition
 * - @/types: ActionState type for server actions
 *
 * @notes
 * - We handle potential DB errors with try/catch and return isSuccess: false if caught
 * - We use eq() from drizzle-orm for equality checks
 */

"use server"

import { db } from "@/db/db"
import {
  InsertMessage,
  messagesTable,
  SelectMessage
} from "@/db/schema/messages-schema"
import { eq, and, desc } from "drizzle-orm"
import { ActionState } from "@/types"
import { extractRequestFromChat } from "@/lib/utils/index"
import { updateProjectAction } from "./projects-actions"

/**
 * Creates a new message for a given chat session.
 * @param newMessage An InsertMessage object containing chatId, content, and role
 * @returns ActionState<SelectMessage> with the newly inserted message or an error
 *
 * @example
 * const newMsg = await createMessageAction({
 *   chatId: "53b4b9b6-42cf-4f4f-8b0f-3077a135cdf5",
 *   content: "Hello, how can I help?",
 *   role: "assistant"
 * })
 */
export async function createMessageAction(
  newMessage: InsertMessage
): Promise<ActionState<SelectMessage>> {
  try {
    // Insert the message and return the inserted record
    const [createdMessage] = await db
      .insert(messagesTable)
      .values(newMessage)
      .returning()

    return {
      isSuccess: true,
      message: "Message created successfully",
      data: createdMessage
    }
  } catch (error) {
    console.error("Error creating message:", error)
    return {
      isSuccess: false,
      message: "Failed to create message"
    }
  }
}

/**
 * Retrieves all messages for a given chat session.
 * @param chatId The UUID of the chat session
 * @returns ActionState<SelectMessage[]> with the list of messages or an error
 *
 * @example
 * const msgs = await getMessagesByChatIdAction("53b4b9b6-42cf-4f4f-8b0f-3077a135cdf5")
 */
export async function getMessagesByChatIdAction(
  chatId: string
): Promise<ActionState<SelectMessage[]>> {
  try {
    // Retrieve all messages for the specified chat session
    const messages = await db.query.messages.findMany({
      where: eq(messagesTable.chatId, chatId)
    })

    return {
      isSuccess: true,
      message: "Messages retrieved successfully",
      data: messages
    }
  } catch (error) {
    console.error("Error retrieving messages by chat ID:", error)
    return {
      isSuccess: false,
      message: "Failed to retrieve messages"
    }
  }
}

export async function updateRequestFromTextChats(
  chatId: string
): Promise<ActionState<string>> {
  try {
    // Get the last assistant message directly from the database
    // using a SQL query with filtering and ordering
    const [lastAiMessage] = await db.query.messages.findMany({
      where: messages =>
        and(eq(messages.chatId, chatId), eq(messages.role, "assistant")),
      orderBy: (messages, { desc }) => [desc(messages.createdAt)],
      limit: 1
    })

    if (!lastAiMessage) {
      return {
        isSuccess: false,
        message: "No AI message found in chat"
      }
    }

    const idea = extractRequestFromChat(lastAiMessage.content)
    if (!idea) {
      console.log(lastAiMessage.content)
      console.log(extractRequestFromChat(lastAiMessage.content))
      throw new Error("No idea found in chat")
    }

    const updateRes = await updateProjectAction(chatId, {
      ideaRequest: idea
    })

    if (!updateRes.isSuccess) {
      throw new Error("Failed to update chat session")
    }

    return {
      isSuccess: true,
      message: "Chat summary extracted successfully",
      data: idea
    }
  } catch (error) {
    console.error("Error summarizing chat:", error)
    return { isSuccess: false, message: "Failed to summarize chat" }
  }
}

/**
 * Updates an existing message's content or role.
 * @param messageId The UUID of the message to update
 * @param data Partial<InsertMessage> containing fields to update
 * @returns ActionState<SelectMessage> with the updated message or an error
 *
 * @example
 * const updated = await updateMessageAction("983675ec-d2c8-4ea8-9f9a-3fa462c16a24", {
 *   content: "New content"
 * })
 */
export async function updateMessageAction(
  messageId: string,
  data: Partial<InsertMessage>
): Promise<ActionState<SelectMessage>> {
  try {
    const [updatedMessage] = await db
      .update(messagesTable)
      .set(data)
      .where(eq(messagesTable.id, messageId))
      .returning()

    if (!updatedMessage) {
      return {
        isSuccess: false,
        message: "Message not found to update"
      }
    }

    return {
      isSuccess: true,
      message: "Message updated successfully",
      data: updatedMessage
    }
  } catch (error) {
    console.error("Error updating message:", error)
    return {
      isSuccess: false,
      message: "Failed to update message"
    }
  }
}

/**
 * Deletes a message by its UUID.
 * @param messageId The UUID of the message to delete
 * @returns ActionState<void> indicating success or failure
 *
 * @example
 * const del = await deleteMessageAction("983675ec-d2c8-4ea8-9f9a-3fa462c16a24")
 */
export async function deleteMessageAction(
  messageId: string
): Promise<ActionState<void>> {
  try {
    await db.delete(messagesTable).where(eq(messagesTable.id, messageId))
    return {
      isSuccess: true,
      message: "Message deleted successfully",
      data: undefined
    }
  } catch (error) {
    console.error("Error deleting message:", error)
    return {
      isSuccess: false,
      message: "Failed to delete message"
    }
  }
}
