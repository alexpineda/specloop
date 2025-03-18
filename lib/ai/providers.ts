import { openai } from "@ai-sdk/openai"
import { createOpenAICompatible } from "@ai-sdk/openai-compatible"
const lmstudio = createOpenAICompatible({
  name: "lmstudio",
  baseURL: "http://localhost:1234/v1"
})

const providers = {
  openai,
  lmstudio
}

export type ValidProvider = keyof typeof providers

export const createProvider = (provider: ValidProvider) => {
  return providers[provider]
}
