/*
<ai_context>
Utility functions for handling implementation steps in a plan.
</ai_context>
<recent_changes>
Updated the STEP_REGEX pattern to allow for 0 or more spaces before the first checkbox.
</recent_changes>
*/

export type ImplementationStep = {
  id: number
  title: string
  details: string
  completed: boolean
}

// Shared regex pattern for all step-related functions
// export const STEP_REGEX =
//   /- \[([xX ])\].+(Step (\d+)): (.+?)\n(?=\n- \[[xX ]\] Step \d+:|\n#{1,6} |\n---|\n\*\*\*|\n___|\n<|$)/g

// Fixed regex pattern to properly capture the step format with flexible leading spaces
export const STEP_REGEX = /^\s*-\s*\[([xX ])\](.+?)(Step (\d+)): (.+?)\n/gm

// Regex to extract detailed content for a specific step
// This improved regex captures all content between step headers, including nested lists and indented content
export const STEP_DETAILS_REGEX =
  /-\s*\[[xX ]\].+Step (\d+): (.+?)(?:\n|\r\n)([\s\S]*?)(?=\n- \[[xX ]\].+Step \d+:|$)/g

export function extractImplementationStepDetails(
  plan: string,
  stepNumber: number
): string {
  // Reset the regex state
  STEP_DETAILS_REGEX.lastIndex = 0

  let match
  while ((match = STEP_DETAILS_REGEX.exec(plan)) !== null) {
    const currentStepNumber = parseInt(match[1], 10)
    if (currentStepNumber === stepNumber) {
      // Return the detailed content for the matching step
      return match[3].trim()
    }
  }

  // If no match found with the primary regex, try a fallback approach
  // This handles cases where the formatting might be different
  const stepHeader = new RegExp(
    `- \\[[xX ]\\].+Step ${stepNumber}: (.+?)(?:\\n|\\r\\n)`,
    "g"
  )
  const nextStepHeader = new RegExp(
    `- \\[[xX ]\\].+Step ${stepNumber + 1}:`,
    "g"
  )

  // Find the start position of the current step
  stepHeader.lastIndex = 0
  const startMatch = stepHeader.exec(plan)
  if (!startMatch) return ""

  const startPos = stepHeader.lastIndex

  // Find the start position of the next step
  nextStepHeader.lastIndex = startPos
  const endMatch = nextStepHeader.exec(plan)
  const endPos = endMatch ? endMatch.index : plan.length

  // Extract everything between the current step header and the next step header
  const stepContent = plan.substring(startPos, endPos).trim()
  return stepContent
}

export function extractImplementationSteps(plan: string): ImplementationStep[] {
  const steps: ImplementationStep[] = []

  // Reset the regex state
  STEP_REGEX.lastIndex = 0

  let match
  while ((match = STEP_REGEX.exec(plan)) !== null) {
    const completed = match[1].toLowerCase() === "x"
    const stepNumber = parseInt(match[4], 10)
    const title = match[5].trim()
    const details = extractImplementationStepDetails(plan, stepNumber)
    steps.push({ id: stepNumber, title, details, completed })
  }

  return steps
}

export function completeStep(plan: string, stepNumber: number): string {
  // Reset the regex state
  STEP_REGEX.lastIndex = 0

  return plan.replace(
    STEP_REGEX,
    (fullMatch, checkbox, prefix, stepLabel, stepNum, title) => {
      if (parseInt(stepNum, 10) === stepNumber) {
        // Replace the checkbox with [X] for the matching step
        return `- [X]${prefix}${stepLabel}: ${title}\n`
      }
      // Return unchanged for non-matching steps
      return fullMatch
    }
  )
}

export function deleteStep(plan: string, stepNumber: number): string {
  // Reset the regex state
  STEP_REGEX.lastIndex = 0

  return plan.replace(
    STEP_REGEX,
    (fullMatch, checkbox, prefix, stepLabel, stepNum, title) => {
      if (parseInt(stepNum, 10) === stepNumber) {
        // Return empty string to delete the matching step
        return ""
      }
      // Return unchanged for non-matching steps
      return fullMatch
    }
  )
}
