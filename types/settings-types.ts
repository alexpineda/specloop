import { z } from "zod"

import projectRulesPrompt from "@/assets/1c_project_rules_prompt.md?raw"
import codeTemplatePrompt from "@/assets/1d_code_template_prompt.md?raw"

const PromptSchema = z.object({
  projectRequest: z.string(),
  template: z.string(),
  rules: z.string(),
  spec: z.string(),
  implementationPlan: z.string(),
  codegen: z.string(),
  codeReview: z.string()
})

const PromptVarsSchema = z.object({
  idea: z.string(),
  projectRequest: z.string(),
  rules: z.string(),
  spec: z.string(),
  implementationPlan: z.string(),
  starterTemplate: z.string(),
  code: z.string()
})

const LlmSchema = z.object({
  small: z.object({
    provider: z.string(),
    model: z.string()
  }),
  medium: z.object({
    provider: z.string(),
    model: z.string()
  }),
  large: z.object({
    provider: z.string(),
    model: z.string()
  })
})

export const SettingsSchema = z.object({
  prompts: PromptSchema,
  promptVars: PromptVarsSchema,
  llm: LlmSchema,
  keys: z
    .object({
      openai_key: z.string().optional()
    })
    .optional()
})

export type Settings = z.infer<typeof SettingsSchema>

export const defaultSettings: Settings = {
  prompts: {
    projectRequest: "",
    template: codeTemplatePrompt,
    rules: projectRulesPrompt,
    spec: "",
    implementationPlan: "",
    codegen: "",
    codeReview: ""
  },
  promptVars: {
    idea: "{{IDEA}}",
    projectRequest: "{{PROJECT_REQUEST}}",
    spec: "{{TECHNICAL_SPECIFICATION}}",
    implementationPlan: "{{IMPLEMENTATION_PLAN}}",
    starterTemplate: "{{STARTER_TEMPLATE}}",
    code: "{{EXISTING_CODE}}",
    rules: "{{PROJECT_RULES}}"
  },
  llm: {
    small: {
      provider: "openai",
      model: "gpt-4o-mini"
    },
    medium: {
      provider: "openai",
      model: "gpt-4o"
    },
    large: {
      provider: "openai",
      model: "gpt-o3-mini"
    }
  },
  keys: {
    openai_key: ""
  }
}
