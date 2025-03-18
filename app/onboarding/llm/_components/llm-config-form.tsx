/*
<ai_context>
Main form component for the LLM configuration page.
</ai_context>
<recent_changes>
Changed model selection from dropdown to text input fields to allow direct entry of model IDs.
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Settings, defaultSettings } from "@/types/settings-types"
import { updateSettingsAction } from "@/actions/db/settings-actions"
import { EyeIcon, EyeOffIcon } from "lucide-react"

interface LlmConfigFormProps {
  initialSettings?: Settings
}

export default function LlmConfigForm({ initialSettings }: LlmConfigFormProps) {
  const { toast } = useToast()
  const [settings, setSettings] = useState<Settings>(
    initialSettings || defaultSettings
  )
  const [isSaving, setIsSaving] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)

  const handleModelChange = (size: keyof Settings["llm"], model: string) => {
    if (size === "small" || size === "medium" || size === "large") {
      setSettings(prev => ({
        ...prev,
        llm: {
          ...prev.llm,
          [size]: {
            ...prev.llm[size],
            model
          }
        }
      }))
    }
  }

  const handleApiKeyChange = (value: string) => {
    setSettings(prev => ({
      ...prev,
      keys: {
        ...prev.keys,
        openai_key: value
      }
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const result = await updateSettingsAction({
        llm: settings.llm,
        keys: settings.keys
      })

      if (result.isSuccess) {
        toast({
          title: "Success",
          description: "LLM configuration saved successfully",
          variant: "default"
        })
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to save LLM configuration",
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>LLM Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">API Key</h3>
          <p className="text-muted-foreground text-sm">
            Enter your OpenAI API key to use the LLM features. Your key is
            stored securely and never shared.
          </p>

          <div className="space-y-2">
            <Label htmlFor="api-key" className="text-sm">
              OpenAI API Key
            </Label>
            <div className="relative">
              <Input
                id="api-key"
                type={showApiKey ? "text" : "password"}
                value={settings.keys?.openai_key || ""}
                onChange={e => handleApiKeyChange(e.target.value)}
                placeholder="sk-... or empty to read from environment"
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? (
                  <EyeOffIcon className="h-4 w-4" />
                ) : (
                  <EyeIcon className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-muted-foreground text-xs">
              Get your API key from{" "}
              <a
                href="https://platform.openai.com/account/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                OpenAI's website
              </a>
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Model Selection</h3>
          <p className="text-muted-foreground text-sm">
            Enter model IDs to use for different task sizes. Smaller models are
            faster and cheaper, while larger models are more capable.
          </p>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="small-model" className="text-sm">
                Small Model (Fast)
              </Label>
              <Input
                id="small-model"
                value={settings.llm.small.model}
                onChange={e => handleModelChange("small", e.target.value)}
                placeholder="e.g., gpt-3.5-turbo"
              />
              <p className="text-muted-foreground text-xs">
                Used for simpler tasks like summarization and classification.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="medium-model" className="text-sm">
                Medium Model (Balanced)
              </Label>
              <Input
                id="medium-model"
                value={settings.llm.medium.model}
                onChange={e => handleModelChange("medium", e.target.value)}
                placeholder="e.g., gpt-4o-mini"
              />
              <p className="text-muted-foreground text-xs">
                Used for most tasks like code generation and planning.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="large-model" className="text-sm">
                Large Model (Powerful)
              </Label>
              <Input
                id="large-model"
                value={settings.llm.large.model}
                onChange={e => handleModelChange("large", e.target.value)}
                placeholder="e.g., gpt-4o"
              />
              <p className="text-muted-foreground text-xs">
                Used for complex tasks requiring deep reasoning.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Configuration"}
        </Button>
      </CardFooter>
    </Card>
  )
}
