/*
<ai_context>
Contains server actions related to settings in the DB.
</ai_context>
<recent_changes>
Created server actions for saving and retrieving settings.
</recent_changes>
*/

"use server"

import { db } from "@/db/db"
import { settingsTable } from "@/db/schema/settings-schema"
import { Settings, SettingsSchema } from "@/types/settings-types"
import { ActionState } from "@/types"
import { getProjectByIdAction } from "./projects-actions"
import { projectsTable } from "@/db/schema"

/**
 * Saves settings to the database.
 * If settings don't exist, creates a new record.
 * If settings exist, updates the existing record.
 */
export async function saveSettingsAction(
  settings: Settings
): Promise<ActionState<Settings>> {
  try {
    // Validate settings against schema
    const validationResult = SettingsSchema.safeParse(settings)
    if (!validationResult.success) {
      return {
        isSuccess: false,
        message: `Invalid settings: ${validationResult.error.message}`
      }
    }

    // Check if settings already exist
    const existingSettings = await db.query.settings.findFirst()

    if (existingSettings) {
      // Update existing settings
      const [updatedSettings] = await db
        .update(settingsTable)
        .set({ settings: settings })
        .returning()

      return {
        isSuccess: true,
        message: "Settings updated successfully",
        data: updatedSettings.settings as Settings
      }
    } else {
      // Create new settings
      const [newSettings] = await db
        .insert(settingsTable)
        .values({ settings: settings })
        .returning()

      return {
        isSuccess: true,
        message: "Settings created successfully",
        data: newSettings.settings as Settings
      }
    }
  } catch (error) {
    console.error("Error saving settings:", error)
    return { isSuccess: false, message: "Failed to save settings" }
  }
}

/**
 * Retrieves settings from the database.
 * Returns default empty settings if no settings exist.
 */
export async function getSettingsAction(): Promise<ActionState<Settings>> {
  try {
    const settings = await db.query.settings.findFirst()

    if (!settings) {
      // Return default empty settings
      return {
        isSuccess: false,
        message: "No settings found"
      }
    }

    const data = SettingsSchema.parse(settings.settings)
    return {
      isSuccess: true,
      message: "Settings retrieved successfully",
      data: data
    }
  } catch (error) {
    return { isSuccess: false, message: "Failed to retrieve settings" }
  }
}

/**
 * Updates specific settings fields without overwriting the entire settings object.
 * Merges the provided partial settings with existing settings.
 */
export async function updateSettingsAction(
  partialSettings: Partial<Settings>
): Promise<ActionState<Settings>> {
  try {
    // Get existing settings
    const existingSettingsResult = await getSettingsAction()

    if (!existingSettingsResult.isSuccess) {
      return existingSettingsResult
    }

    const existingSettings = existingSettingsResult.data || {}

    // Merge existing settings with new partial settings
    const mergedSettings = {
      ...existingSettings,
      ...partialSettings
    }

    // Validate merged settings
    const validationResult = SettingsSchema.safeParse(mergedSettings)
    if (!validationResult.success) {
      return {
        isSuccess: false,
        message: `Invalid settings: ${validationResult.error.message}`
      }
    }

    // Save merged settings
    return await saveSettingsAction(mergedSettings)
  } catch (error) {
    console.error("Error updating settings:", error)
    return { isSuccess: false, message: "Failed to update settings" }
  }
}

export async function getRawPromptAction(
  promptType: keyof Settings["prompts"]
): Promise<ActionState<string>> {
  const settings = await getSettingsAction()

  if (!settings.isSuccess) {
    return settings
  }

  const prompt = settings.data.prompts?.[promptType]

  if (!prompt) {
    return { isSuccess: false, message: `Prompt ${promptType} not found` }
  }

  return {
    isSuccess: true,
    message: "Prompt retrieved successfully",
    data: prompt
  }
}

export async function getPreparedPromptAction(
  projectId: string,
  promptType: keyof Settings["prompts"],
  _settings?: Settings
) {
  try {
    let settings = _settings
    if (!_settings) {
      const settingsResult = await getSettingsAction()
      if (!settingsResult.isSuccess) {
        return settingsResult
      }
      settings = settingsResult.data
    }

    let prompt = settings!.prompts[promptType]

    if (!prompt) {
      return { isSuccess: false, message: `Prompt ${promptType} not found` }
    }

    const project = await getProjectByIdAction(projectId)
    if (!project.isSuccess) {
      return project
    }
    console.log(Object.keys(project.data))

    const remap = {
      projectRequest: "ideaRequest",
      rules: "projectRules",
      code: "existingCode"
    }
    if (settings?.promptVars) {
      for (const [key, value] of Object.entries(settings.promptVars)) {
        const remappedKey = remap[key as keyof typeof remap] ?? key
        const columnName =
          projectsTable[remappedKey as keyof typeof projectsTable]?.name
        const rawPrompt = project.data[
          remappedKey as keyof typeof project.data
        ] as string
        console.log(remappedKey, columnName, Boolean(rawPrompt))
        if (remappedKey) {
          prompt = prompt.replace(value, rawPrompt)
        }
      }
    }

    return {
      isSuccess: true,
      message: "Implementation plan prompt compiled successfully",
      data: { prompt: prompt }
    }
  } catch (error) {
    console.error("Error in compileImplementationPlanPrompt:", error)
    return {
      isSuccess: false,
      message: "Failed to compile implementation plan prompt"
    }
  }
}
