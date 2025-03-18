/**
 * @file ideation-chat.tsx
 * @description
 * A client component that embeds a minimal chat UI specifically for the Ideation stage.
 * Users can input messages, which are sent to the AI using processChatMessageAction, and see the AI's response.
 *
 * Key features:
 * - Keeps a local message list
 * - Sends user messages to processChatMessageAction
 * - Displays assistant responses
 *
 * @dependencies
 * - React (useState, useEffect, useRef) for local state & scrolling
 * - processChatMessageAction from "@/actions/ai-actions" for AI calls
 * - toast from "@/lib/hooks/use-toast" for error/success messaging
 * - Textarea, Button from shadcn UI
 * - react-markdown for rendering assistant messages as Markdown
 *
 * @notes
 * - The parent server component (ideation-page) fetches 'initialMessages' from the DB
 *   and passes them in. We combine them with newly added messages in local state.
 * - Step 42: We now use ReactMarkdown for assistant messages
 */

"use client"

import { useState, useRef, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { SelectMessage } from "@/db/schema/messages-schema"
import { toast } from "@/lib/hooks/use-toast"
import { respondToUserChatMessageAction } from "@/actions/ai/ai-actions"
import ReactMarkdown from "react-markdown"
import { removeRequestFromChat } from "@/lib/utils/index"

// Use NODE_ENV for debug check
const isDev = process.env.NODE_ENV === "development"

interface IdeationChatProps {
  /**
   * The chat session ID for this ideation session.
   */
  chatId: string

  /**
   * The initial messages retrieved from DB (both user & assistant).
   */
  initialMessages: SelectMessage[]
}

/**
 * A minimal chat UI for the Ideation stage.
 * Shows messages, provides input to send new ones, and calls AI for responses.
 */
export default function IdeationChat({
  chatId,
  initialMessages
}: IdeationChatProps) {
  // Local state for messages
  const [messages, setMessages] = useState<SelectMessage[]>(initialMessages)
  // The user's current input
  const [userInput, setUserInput] = useState("")
  // Loading state for AI calls
  const [isLoading, setIsLoading] = useState(false)
  // Debug state for showing raw messages
  const [showRaw, setShowRaw] = useState(false)

  // Scroll container reference
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  /**
   * handleSend
   * Sends the user's message to the AI, stores both user and assistant messages in local state.
   */
  async function handleSend() {
    if (!userInput.trim()) return
    setIsLoading(true)

    // Locally add user message
    const userMsgLocal: SelectMessage = {
      id: crypto.randomUUID(),
      chatId,
      role: "user",
      content: userInput,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    setMessages(prev => [...prev, userMsgLocal])
    setUserInput("")

    try {
      // Call server action for AI response
      const aiRes = await respondToUserChatMessageAction({
        chatId,
        userContent: userMsgLocal.content
      })
      if (!aiRes.isSuccess || !aiRes.data?.assistantMessage) {
        throw new Error(aiRes.message || "AI response failed.")
      }

      // Insert assistant message
      const asstMsg = aiRes.data.assistantMessage
      const asstMsgLocal: SelectMessage = {
        id: asstMsg.id,
        chatId: asstMsg.chatId,
        role: asstMsg.role,
        content: asstMsg.content,
        createdAt: new Date(asstMsg.createdAt),
        updatedAt: new Date(asstMsg.updatedAt)
      }
      setMessages(prev => [...prev, asstMsgLocal])
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to send message",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * handleKeyDown
   * Submits message on Enter press (without shift).
   */
  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex h-[600px] flex-col rounded border p-6">
      {/* Debug toggle */}
      {isDev && (
        <div className="mb-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowRaw(!showRaw)}
            className="mb-2"
          >
            {showRaw ? "Hide Raw" : "Show Raw"}
          </Button>
        </div>
      )}

      {/* Messages container - made taller and wider */}
      <div
        ref={chatContainerRef}
        className="bg-secondary mb-3 flex-1 space-y-4 overflow-auto rounded p-6"
      >
        {messages.map(m => {
          const isAssistant = m.role === "assistant"

          return (
            <div
              key={m.id}
              className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`max-w-[90%] rounded-lg p-4 text-sm ${
                  isAssistant
                    ? "bg-accent text-accent-foreground"
                    : "bg-primary text-primary-foreground"
                }`}
              >
                {isAssistant ? (
                  showRaw ? (
                    <pre className="whitespace-pre-wrap">{m.content}</pre>
                  ) : (
                    <ReactMarkdown>
                      {removeRequestFromChat(m.content)}
                    </ReactMarkdown>
                  )
                ) : (
                  m.content
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Input area - wider spacing */}
      <div className="flex items-center space-x-3">
        <Textarea
          value={userInput}
          onChange={e => setUserInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask or refine your idea..."
          disabled={isLoading}
          className="max-h-[80px] min-h-[40px] flex-1 resize-none overflow-y-auto"
          rows={3}
        />
        <Button onClick={handleSend} disabled={isLoading}>
          {isLoading ? "Thinking..." : "Send"}
        </Button>
      </div>
    </div>
  )
}
