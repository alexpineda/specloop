"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import {
  extractImplementationSteps,
  extractImplementationStepDetails,
  ImplementationStep
} from "@/lib/utils/plan-utils"
import ReactMarkdown from "react-markdown"
import {
  markStepCompleteAction,
  updateExistingCodeAction
} from "@/actions/db/projects-actions"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Editor from "@monaco-editor/react"
import {
  Copy,
  Cpu,
  ChevronDown,
  Check,
  Clipboard,
  RefreshCw
} from "lucide-react"
import { GenerateModalButton } from "@/components/generate-modal-button"
import { StageHeader } from "@/components/stage/stage-header"
import { useTheme } from "next-themes"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

/**
 * Custom hook for debouncing values
 */
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

interface CodegenStageProps {
  projectId: string
  lastGeneratedSnippet: string
  implementationPlan: string
  existingCode: string
}

export default function CodegenStage({
  projectId,
  lastGeneratedSnippet,
  implementationPlan,
  existingCode
}: CodegenStageProps) {
  const [parsedTasks, setParsedTasks] = useState<ImplementationStep[]>([])
  const [selectedTaskIndex, setSelectedTaskIndex] = useState<number>(0)
  const [isMarkingComplete, setIsMarkingComplete] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isPasting, setIsPasting] = useState(false)
  const [localExistingCode, setLocalExistingCode] = useState(existingCode)
  const [activeTab, setActiveTab] = useState<"generated" | "existing">(
    "generated"
  )
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true)
  const [currentStepDetails, setCurrentStepDetails] = useState<string>("")
  const { theme } = useTheme()
  const router = useRouter()
  const { toast } = useToast()

  // Debounce the code changes
  const debouncedCode = useDebounce(localExistingCode, 1500)

  const currentStepTitle = `${selectedTaskIndex + 1}. ${parsedTasks[selectedTaskIndex]?.title}`

  // Parse tasks on mount
  useEffect(() => {
    if (implementationPlan.trim()) {
      const tasks = extractImplementationSteps(implementationPlan)
      setParsedTasks(tasks)
      // Find first incomplete step
      const nextIncompleteIndex = tasks.findIndex(task => !task.completed)
      const initialIndex = nextIncompleteIndex >= 0 ? nextIncompleteIndex : 0
      setSelectedTaskIndex(initialIndex)

      // Get detailed content for the selected step
      if (tasks.length > 0 && initialIndex < tasks.length) {
        const stepNumber = tasks[initialIndex].id
        const details = extractImplementationStepDetails(
          implementationPlan,
          stepNumber
        )
        setCurrentStepDetails(details)
      }
    }
  }, [implementationPlan])

  // Update step details when selected task changes
  useEffect(() => {
    if (parsedTasks.length > 0 && selectedTaskIndex < parsedTasks.length) {
      const stepNumber = parsedTasks[selectedTaskIndex].id
      const details = extractImplementationStepDetails(
        implementationPlan,
        stepNumber
      )
      setCurrentStepDetails(details)
    }
  }, [selectedTaskIndex, implementationPlan, parsedTasks])

  // Auto-save effect when debounced code changes
  useEffect(() => {
    // Skip initial render and only save if auto-save is enabled
    if (debouncedCode !== existingCode && autoSaveEnabled) {
      handleAutoSave()
    }
  }, [debouncedCode]) // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * handleAutoSave
   * Automatically saves code changes after debounce
   */
  const handleAutoSave = useCallback(async () => {
    try {
      setIsSaving(true)
      const res = await updateExistingCodeAction(projectId, debouncedCode)
      if (!res.isSuccess) {
        throw new Error(res.message)
      }

      // Show a subtle toast notification
      toast({
        title: "Auto-saved",
        description: "Your code has been automatically saved",
        duration: 2000
      })

      router.refresh()
    } catch (error: any) {
      toast({
        title: "Auto-save failed",
        description: error.message || "Failed to auto-save code",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }, [debouncedCode, projectId, router, toast])

  /**
   * handleCopyCode
   * Copies the last generated snippet to the user's clipboard.
   */
  async function handleCopyCode() {
    if (!lastGeneratedSnippet) return
    try {
      await navigator.clipboard.writeText(lastGeneratedSnippet)
      toast({ title: "Copied", description: "Code snippet copied!" })
    } catch (error: any) {
      toast({
        title: "Clipboard Error",
        description: error.message || "Failed to copy code snippet",
        variant: "destructive"
      })
    }
  }

  /**
   * handleCopyTask
   * Copies the current task details to the user's clipboard.
   */
  function handleCopyTask() {
    const currentTask = parsedTasks[selectedTaskIndex]
    if (!currentTask) return

    try {
      const taskText = `# ${currentTask.title}\n\n${currentStepDetails || ""}`
      navigator.clipboard.writeText(taskText).then(() => {
        toast({ title: "Copied", description: "Task details copied!" })
      })
    } catch (error: any) {
      toast({
        title: "Clipboard Error",
        description: error.message || "Failed to copy task details",
        variant: "destructive"
      })
    }
  }

  /**
   * handleMarkComplete
   * Marks the current step as complete in the database
   */
  async function handleMarkComplete() {
    try {
      setIsMarkingComplete(true)
      const stepNumber = selectedTaskIndex + 1 // Convert to 1-based index
      const result = await markStepCompleteAction(projectId, stepNumber)
      if (!result.isSuccess) {
        throw new Error(result.message)
      }
      // Update local state
      setParsedTasks(prev => {
        const newTasks = prev.map((task, i) =>
          i === selectedTaskIndex ? { ...task, completed: true } : task
        )
        // Find and set next incomplete step
        const nextIncompleteIndex = newTasks.findIndex(
          (task, i) => !task.completed && i > selectedTaskIndex
        )
        setSelectedTaskIndex(
          nextIncompleteIndex >= 0 ? nextIncompleteIndex : selectedTaskIndex
        )
        return newTasks
      })
      toast({
        title: "Step Completed",
        description: `Step ${stepNumber} marked as complete`
      })

      // Add reminder toast to update codebase
      toast({
        title: "Remember to update your codebase",
        description:
          "If you've made changes based on this step, don't forget to update your codebase.",
        action: (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveTab("existing")}
          >
            <RefreshCw className="mr-2 size-4" />
            Update
          </Button>
        )
      })

      // Refresh the route to update the sidebar and clear the generated code
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to mark step as complete",
        variant: "destructive"
      })
    } finally {
      setIsMarkingComplete(false)
    }
  }

  /**
   * handlePasteCode
   * Pastes the contents of the clipboard into the editor and saves it to the database
   */
  async function handlePasteCode() {
    try {
      setIsPasting(true)
      const clipboardText = await navigator.clipboard.readText()
      if (!clipboardText) {
        toast({
          title: "Clipboard Empty",
          description: "No text found in clipboard",
          variant: "destructive"
        })
        return
      }

      // Update local state
      setLocalExistingCode(clipboardText)

      // Save to database
      const res = await updateExistingCodeAction(projectId, clipboardText)
      if (!res.isSuccess) {
        throw new Error(res.message)
      }

      toast({
        title: "Pasted & Saved",
        description: "Code updated successfully from clipboard"
      })
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to paste and save code",
        variant: "destructive"
      })
    } finally {
      setIsPasting(false)
    }
  }

  /**
   * handleSaveExistingCode
   * Manually saves the current code to the database
   */
  async function handleSaveExistingCode() {
    try {
      setIsSaving(true)
      const res = await updateExistingCodeAction(projectId, localExistingCode)
      if (!res.isSuccess) {
        throw new Error(res.message)
      }
      toast({ title: "Saved", description: "Code updated successfully" })
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save code",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-120px)] w-full flex-col p-4">
      <StageHeader
        title="Code Generation"
        description="Generate and manage code for your project."
        icon={Cpu}
        nextButton={
          <Button
            onClick={handleMarkComplete}
            disabled={
              isMarkingComplete || parsedTasks[selectedTaskIndex]?.completed
            }
          >
            {isMarkingComplete
              ? "Marking Complete..."
              : parsedTasks[selectedTaskIndex]?.completed
                ? "Step Completed"
                : "Next: Mark this step as complete"}
          </Button>
        }
      >
        <div className="flex gap-2">
          <GenerateModalButton
            projectId={projectId}
            label="Generate code for this step"
            promptType="codegen"
            append={`\n\nIf you're not sure what step to generate code for, here's the step details: \n\n${currentStepTitle}\n\n${currentStepDetails}`}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyTask}
            className="flex items-center gap-1"
          >
            <Copy className="size-4" />
            Copy Task
          </Button>
        </div>
      </StageHeader>

      {/* Show the snippet if we have one */}
      {(lastGeneratedSnippet || existingCode) && (
        <div className="mt-6 flex flex-1 flex-col overflow-hidden border">
          <div className="flex items-center justify-between border-b p-4">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">
                  {selectedTaskIndex + 1}.{" "}
                  {parsedTasks[selectedTaskIndex]?.title}
                </h2>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 gap-1">
                      <span>
                        Step {selectedTaskIndex + 1} of {parsedTasks.length}
                      </span>
                      <ChevronDown className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="max-h-[300px] w-[220px] overflow-y-auto"
                  >
                    {parsedTasks.map((task, index) => (
                      <DropdownMenuItem
                        key={index}
                        onClick={() => setSelectedTaskIndex(index)}
                        className="flex items-center justify-between"
                      >
                        <span className="truncate">
                          Step {task.id}: {task.title}
                        </span>
                        {task.completed && (
                          <Check className="ml-2 size-4 text-green-500" />
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {parsedTasks[selectedTaskIndex] && (
                <p className="text-muted-foreground mt-1 text-sm">
                  {parsedTasks[selectedTaskIndex].title}
                </p>
              )}
            </div>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={value =>
              setActiveTab(value as "generated" | "existing")
            }
            className="flex h-full flex-1 flex-col"
          >
            <TabsList>
              <TabsTrigger value="existing">Your Code Base</TabsTrigger>
              <TabsTrigger value="generated">Step Details</TabsTrigger>
            </TabsList>
            <TabsContent
              value="generated"
              className="relative h-full flex-1 overflow-auto p-4"
            >
              <div className="mb-4 flex gap-2">
                {currentStepDetails && (
                  <div className="w-full border-b px-4 py-2">
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown>{currentStepDetails}</ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                {lastGeneratedSnippet && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-50 hover:opacity-100"
                    onClick={handleCopyCode}
                  >
                    <Copy className="size-4" />
                  </Button>
                )}
                <ReactMarkdown>{lastGeneratedSnippet}</ReactMarkdown>
              </div>
            </TabsContent>
            <TabsContent
              value="existing"
              className="relative h-full min-h-[500px] flex-1 p-0"
            >
              <div className="mb-4 flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 opacity-50 hover:opacity-100"
                  onClick={handlePasteCode}
                  disabled={isPasting}
                >
                  <Clipboard className="size-4" />
                  {isPasting ? "Pasting..." : "Paste"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-50 hover:opacity-100"
                  onClick={handleSaveExistingCode}
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`opacity-50 hover:opacity-100 ${autoSaveEnabled ? "text-green-500" : ""}`}
                  onClick={() => setAutoSaveEnabled(!autoSaveEnabled)}
                >
                  {autoSaveEnabled ? "Auto-save: On" : "Auto-save: Off"}
                </Button>
              </div>

              <Editor
                height="100%"
                defaultLanguage="typescript"
                value={localExistingCode}
                theme={theme === "dark" ? "vs-dark" : "light"}
                onChange={value => setLocalExistingCode(value || "")}
                options={{
                  minimap: { enabled: true },
                  scrollBeyondLastLine: false,
                  fontSize: 14,
                  wordWrap: "on"
                }}
              />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}
