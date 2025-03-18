/*
<ai_context>
A button component that opens a modal to display prepared prompts for different project stages.
</ai_context>
<recent_changes>
Added a reminder toast when the dialog closes to prompt users to update their codebase if they've made changes.
</recent_changes>
*/

"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { ButtonProps } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { AlertTriangle, Copy, RefreshCw } from "lucide-react"
import Editor from "@monaco-editor/react"
import { Button } from "@/components/ui/button"
import { Settings } from "@/types"
import { getPreparedPromptAction } from "@/actions/db/settings-actions"
import { useTheme } from "next-themes"
interface GenerateSplitButtonProps
  extends Pick<ButtonProps, "variant" | "size" | "className"> {
  label: string
  promptType: keyof Settings["prompts"]
  projectId: string
  warning?: string
  onUpdateCodebaseClick?: () => void
  append?: string
}

export function GenerateModalButton({
  label,
  promptType,
  variant = "default",
  size = "default",
  className,
  warning,
  projectId,
  append
}: GenerateSplitButtonProps) {
  const [showPrompt, setShowPrompt] = useState(false)
  const [promptContent, setPromptContent] = useState("")
  const { theme } = useTheme()
  const { toast } = useToast()

  const handleViewPrompt = async () => {
    const result = await getPreparedPromptAction(projectId, promptType)
    if (result.isSuccess && result.data) {
      setPromptContent(result.data.prompt + (append || ""))
      setShowPrompt(true)
    } else {
      console.error(result.message)
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive"
      })
    }
  }

  const handleDialogChange = (open: boolean) => {
    setShowPrompt(open)
  }

  const MainButtonContent = (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleViewPrompt}
    >
      {label}
    </Button>
  )

  const estimatedTokenCount = Math.round(promptContent.length / 4)

  return (
    <>
      {MainButtonContent}
      <Dialog open={showPrompt} onOpenChange={handleDialogChange}>
        <DialogContent className="max-h-[80vh] max-w-[80vw]">
          <DialogHeader>
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DialogTitle>{label}</DialogTitle>
                  <p className="text-muted-foreground text-sm">
                    ~{estimatedTokenCount} tokens
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(promptContent)
                      toast({
                        title: "Copied",
                        description: "Copied to clipboard"
                      })
                    }}
                  >
                    <Copy className="size-4" />
                    Copy for o1-pro (Recommended)
                  </Button>
                  {/* <Link href={getGenerateUrl(promptType, projectId)}>
                  <Button
                    variant="ghost"
                    className="opacity-50 hover:opacity-100"
                  >
                    Generate (Experimental)
                  </Button>
                </Link> */}
                </div>
              </div>
              {warning && (
                <div className="flex items-center gap-2 text-sm text-orange-500">
                  <AlertTriangle className="size-4" />
                  {warning}
                </div>
              )}
            </div>
          </DialogHeader>
          <Editor
            height="60vh"
            defaultLanguage="markdown"
            value={promptContent}
            theme={theme === "dark" ? "vs-dark" : "light"}
            options={{
              minimap: { enabled: true },
              scrollBeyondLastLine: false,
              fontSize: 14,
              wordWrap: "on",
              readOnly: true
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}

const getGenerateUrl = (
  promptType: keyof Settings["prompts"],
  projectId: string
) => {
  switch (promptType) {
    case "template":
      return `/project/${projectId}/template/generate`
    case "rules":
      return `/project/${projectId}/rules/generate`
    case "spec":
      return `/project/${projectId}/spec/generate`
    case "implementationPlan":
      return `/project/${projectId}/plan/generate`
    case "codegen":
      return `/project/${projectId}/codegen/generate`
    default:
      throw new Error(`Unknown prompt type: ${promptType}`)
  }
}
