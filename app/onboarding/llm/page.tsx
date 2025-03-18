/*
<ai_context>
LLM configuration page where users can set their OpenAI API key and model preferences.
</ai_context>
<recent_changes>
Created a complete LLM configuration page with form for API key and model selection.
</recent_changes>
*/

"use server"

import { Suspense } from "react"
import { getSettingsAction } from "@/actions/db/settings-actions"
import LlmConfigForm from "./_components/llm-config-form"
import LlmConfigSkeleton from "./_components/llm-config-skeleton"

export default async function LlmPage() {
  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">LLM Configuration</h1>
      <p className="mb-4">
        Configure your OpenAI API key and model preferences. Currently, only
        OpenAI is supported, but more providers will be added in the future.
      </p>
      <p className="text-muted-foreground mb-8">
        Your API key is stored securely and is only used to make requests to the
        OpenAI API. You can get your API key from the{" "}
        <a
          href="https://platform.openai.com/api-keys"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary font-medium hover:underline"
        >
          OpenAI dashboard
        </a>
        .
      </p>

      <Suspense fallback={<LlmConfigSkeleton />}>
        <LlmConfigLoader />
      </Suspense>
    </div>
  )
}

async function LlmConfigLoader() {
  const settingsResult = await getSettingsAction()
  const settings = settingsResult.isSuccess ? settingsResult.data : undefined

  return <LlmConfigForm initialSettings={settings} />
}
