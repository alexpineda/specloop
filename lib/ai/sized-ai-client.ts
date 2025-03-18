import { Settings } from "@/types"
import { getSettingsAction } from "@/actions/db/settings-actions"
import { createProvider, ValidProvider } from "./providers"

const _getSettings = async (settings?: Settings) => {
  if (!settings) {
    const settings = await getSettingsAction()
    if (!settings.isSuccess) {
      throw new Error("Failed to get settings")
    }
    return settings.data
  }
  return settings
}

export const getSizedAiClient = async (
  size: keyof Settings["llm"],
  _settings?: Settings
) => {
  const settings = await _getSettings(_settings)
  return [
    await createProvider(settings.llm[size].provider as ValidProvider),
    settings.llm[size].model
  ] as const
}
