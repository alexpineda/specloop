/*
<ai_context>
Prompt configuration page where users can add and edit their prompts.
</ai_context>
<recent_changes>
Created a complete prompt configuration page with tabs for different prompt types, text areas for editing, and save functionality.
Added a blurb about Takeoff School prompts as a recommendation source.
</recent_changes>
*/

"use server"

import { Suspense } from "react"
import {
  getSettingsAction,
  updateSettingsAction
} from "@/actions/db/settings-actions"
import PromptConfigForm from "./_components/prompt-config-form"
import PromptConfigSkeleton from "./_components/prompt-config-skeleton"

export default async function PromptsPage() {
  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Prompt Configuration</h1>
      <p className="mb-4">
        Need inspiration for effective prompts? We recommend checking out{" "}
        <a
          href="https://www.jointakeoff.com/prompts"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary font-medium hover:underline"
        >
          Takeoff School's prompt library
        </a>
        . Their innovative approach to prompt engineering inspired this
        application, and their collection offers excellent examples you can
        adapt for your needs. You will have to modify the prompt keys to match.
      </p>
      <p className="text-muted-foreground mb-8">
        Configure the prompts used for generating content. These prompts will be
        used as templates for AI-generated content throughout the application.
      </p>

      <Suspense fallback={<PromptConfigSkeleton />}>
        <PromptConfigLoader />
      </Suspense>
    </div>
  )
}

async function PromptConfigLoader() {
  const settingsResult = await getSettingsAction()
  const settings = settingsResult.isSuccess ? settingsResult.data : undefined

  return <PromptConfigForm initialSettings={settings} />
}
