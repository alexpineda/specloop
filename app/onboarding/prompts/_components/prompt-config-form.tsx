/*
<ai_context>
Main form component for the prompt configuration page.
</ai_context>
<recent_changes>
Added support for displaying and editing prompt variables with a toggle to show all keys or just the relevant ones for each prompt type.
</recent_changes>
*/

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Settings, defaultSettings } from "@/types/settings-types"
import { updateSettingsAction } from "@/actions/db/settings-actions"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface PromptConfigFormProps {
  initialSettings?: Settings
}

export default function PromptConfigForm({
  initialSettings
}: PromptConfigFormProps) {
  const { toast } = useToast()
  const [settings, setSettings] = useState<Settings>(
    initialSettings || defaultSettings
  )
  const [activeTab, setActiveTab] =
    useState<keyof Settings["prompts"]>("projectRequest")
  const [isSaving, setIsSaving] = useState(false)
  const [showAllKeys, setShowAllKeys] = useState(false)

  const promptTypes: Array<{ id: keyof Settings["prompts"]; label: string }> = [
    { id: "projectRequest", label: "Project Request" },
    { id: "implementationPlan", label: "Implementation Plan" },
    { id: "spec", label: "Specification" },
    { id: "codegen", label: "Code Generation" },
    { id: "codeReview", label: "Code Review" },
    { id: "template", label: "Template" },
    { id: "rules", label: "Rules" }
  ]

  const handlePromptChange = (value: string) => {
    setSettings(prev => ({
      ...prev,
      prompts: {
        ...prev.prompts,
        [activeTab]: value
      }
    }))
  }

  const handlePromptVarChange = (
    key: keyof Settings["promptVars"],
    value: string
  ) => {
    setSettings(prev => ({
      ...prev,
      promptVars: {
        ...prev.promptVars,
        [key]: value
      }
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const result = await updateSettingsAction({
        prompts: settings.prompts,
        promptVars: settings.promptVars
      })

      if (result.isSuccess) {
        toast({
          title: "Success",
          description: "Prompts and variables saved successfully",
          variant: "default"
        })
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to save prompts and variables",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Get the required keys for the current prompt type
  const requiredKeys = getRequiredPromptVars(activeTab)

  // Get all keys for prompt variables
  const allKeys = Object.keys(settings.promptVars) as Array<
    keyof Settings["promptVars"]
  >

  // Determine which keys to display based on the toggle
  const keysToDisplay = showAllKeys ? allKeys : requiredKeys

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prompt Templates</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="projectRequest"
          value={activeTab}
          onValueChange={value =>
            setActiveTab(value as keyof Settings["prompts"])
          }
        >
          <TabsList className="mb-4">
            {promptTypes.map(type => (
              <TabsTrigger key={type.id} value={type.id}>
                {type.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {promptTypes.map(type => (
            <TabsContent key={type.id} value={type.id}>
              <div className="space-y-4">
                <h3 className="text-lg font-medium">{type.label} Prompt</h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  {getPromptDescription(type.id)}
                </p>
                <Textarea
                  value={settings.prompts[type.id]}
                  onChange={e => handlePromptChange(e.target.value)}
                  className="min-h-[400px] font-mono text-sm"
                  placeholder={`Enter your ${type.label.toLowerCase()} prompt here...`}
                />

                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-md font-medium">Prompt Variables</h4>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="show-all-keys" className="text-sm">
                        Show all keys
                      </Label>
                      <Switch
                        id="show-all-keys"
                        checked={showAllKeys}
                        onCheckedChange={setShowAllKeys}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {keysToDisplay.map(key => (
                      <div key={key} className="space-y-2">
                        <Label htmlFor={`var-${key}`} className="text-sm">
                          {formatKeyName(key)}
                          {requiredKeys.includes(key) && (
                            <span className="ml-1 text-red-500">*</span>
                          )}
                        </Label>
                        <Input
                          id={`var-${key}`}
                          value={settings.promptVars[key]}
                          onChange={e =>
                            handlePromptVarChange(key, e.target.value)
                          }
                          placeholder={`Enter value for ${formatKeyName(key).toLowerCase()}`}
                        />
                      </div>
                    ))}
                  </div>

                  {keysToDisplay.length === 0 && (
                    <p className="text-muted-foreground text-sm">
                      No variables required for this prompt type.
                    </p>
                  )}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Prompts & Variables"}
        </Button>
      </CardFooter>
    </Card>
  )
}

function getPromptDescription(promptType: keyof Settings["prompts"]): string {
  const descriptions: Record<keyof Settings["prompts"], string> = {
    projectRequest:
      "The initial project request prompt that defines what the user wants to build.",
    template:
      "An extra helper template used for generating code templates. It's better to have premade code templates but you can still use this if you really need to.",
    rules:
      "Rules and guidelines for the project implementation. It's better to have premade rules but you can still use this if you really need to.",
    spec: "Technical specification for the project.",
    implementationPlan: "Step-by-step implementation plan for the project.",
    codegen: "Prompt for code generation.",
    codeReview: "Prompt for code review."
  }

  return descriptions[promptType]
}

function getRequiredPromptVars(promptType: keyof Settings["prompts"]) {
  const keys: Array<keyof Settings["promptVars"]> = []

  switch (promptType) {
    case "projectRequest":
      keys.push("idea")
      break
    case "rules":
      keys.push("projectRequest")
      break
    case "template":
      keys.push("projectRequest")
      keys.push("rules")
      break
    case "spec":
      keys.push("starterTemplate")
      keys.push("projectRequest")
      keys.push("rules")
      break
    case "implementationPlan":
      keys.push("projectRequest")
      keys.push("rules")
      keys.push("spec")
      keys.push("starterTemplate")
      break

    case "codegen":
    case "codeReview":
      keys.push("projectRequest")
      keys.push("rules")
      keys.push("spec")
      keys.push("code")
      keys.push("implementationPlan")
      break
  }
  return keys
}

// Helper function to format key names for display
function formatKeyName(key: string): string {
  // Convert camelCase to Title Case with spaces
  return key
    .replace(/([A-Z])/g, " $1") // Insert a space before all capital letters
    .replace(/^./, str => str.toUpperCase()) // Capitalize the first letter
}
