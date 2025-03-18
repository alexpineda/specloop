import { getSettingsAction } from "@/actions/db/settings-actions"
import { createOpenAI } from "@ai-sdk/openai"
import { createOpenAICompatible } from "@ai-sdk/openai-compatible"
import { config } from "dotenv"
const lmstudio = createOpenAICompatible({
  name: "lmstudio",
  baseURL: "http://localhost:1234/v1"
})

config({ path: ".env.local" })
export type ValidProvider = "openai"

export const createProvider = async (provider: ValidProvider) => {
  if (provider === "openai") {
    const settings = await getSettingsAction()
    const apiKey =
      settings?.data?.keys?.openai_key || process.env.OPENAI_API_KEY
    return createOpenAI({
      apiKey
    })
  }
  throw new Error(`Provider ${provider} not supported`)
}
