// Test script for plan-utils regex

// Import the regex pattern and extraction function
const {
  STEP_REGEX,
  extractImplementationSteps
} = require("../lib/utils/plan-utils")

// Sample document from the user query
const sampleDoc = `
<doc>
<brainstorming>
We want to outline a series of steps that build toward completing the ScreenPipe "What I Did in a Day" web application. Each step should be logically self-contained, focusing on a small, specific task that can be implemented in one iteration by the code generation system. We'll ensure the plan covers:  

1. Basic project setup and structure.  
2. Database schema modifications for daily compilations and commentary.  
3. Integration with ScreenPipe's local API for data queries.  
4. Video compilation logic (using \`/experimental/frames/merge\` or local ffmpeg).  
5. Summaries and optional voice-cloning approach.  
6. UI components for daily recap listing, playback, "Record Recap," user settings, etc.  
7. Testing approach.  
8. Potential deployment and final checks.  

We'll keep each step short enough that the user (and the code generation AI) can apply them sequentially without exceeding the 20-file change recommendation. We'll also reference any prior steps in "Step Dependencies" if needed.  
</brainstorming>


# Implementation Plan

## 1. Initial Project Setup

- [ ] **Step 1: Establish Core Structure & Environment**  
  - **Task**:  
    1. Confirm a Next.js + TypeScript structure (or Tauri if relevant, but next is indicated).  
    2. Create any necessary \`.env\` placeholders for local dev (like \`SCREENPIPE_DIR\`, etc.).  
    3. Adjust \`package.json\` scripts to ensure \`dev\`, \`build\`, \`start\` commands work.  
    4. Make sure the \`tailwind.config\` references our app, components, etc.  
  - **Files** (approx):  
    - \`package.json\`: Update scripts if needed.  
    - \`next.config.mjs\`: Confirm any relevant config.  
    - \`postcss.config.mjs\` / \`tailwind.config.ts\`: Confirm we're referencing the correct paths.  
    - \`.env.example\`: Provide placeholders for any environment variables (e.g., \`SCREENPIPE_DIR\`).  
  - **Step Dependencies**: None  
  - **User Instructions**: 
    - Run \`npm install\` or \`bun install\` to ensure local dev environment is ready.
    - Provide/rename \`.env.example\` to \`.env\` with real values as needed.

## 2. Database Schema for Daily Compilations

- [ ] **Step 2: Add Tables for \`daily_compilations\` & \`recorded_commentary\`**  
  - **Task**:  
    1. Add \`daily_compilations\` table with columns: \`id\`, \`date\`, \`video_path\`, \`summary_text\`, \`created_at\`.  
    2. Add \`recorded_commentary\` table with columns: \`id\`, \`compilation_id\`, \`audio_path\`, \`transcribed_text\`, \`created_at\`.  
    3. Provide a migration or schema definition snippet.  
  - **Files**:  
    - \`lib/db-schema.sql\` (or your chosen approach for migrations, e.g. Prisma models or raw SQL)  
    - Possibly \`lib/db.ts\` if implementing direct DB calls or migrations.  
  - **Step Dependencies**: **Step 1**  
  - **User Instructions**:  
    - If using raw SQL, run the provided script in your local DB to apply schema changes.  

## 3. Basic Server Actions for Daily Compilations

- [ ] **Step 3: Implement Create/Fetch in Server Actions**  
  - **Task**:  
    1. Implement \`createDailyCompilation(date, video_path, summary_text)\` in a server action file.  
    2. Implement \`addRecordedCommentary(compilation_id, audio_path, transcribed_text)\`.  
    3. Implement \`getCompilationByDate(date)\` to retrieve compilation + commentary.  
  - **Files**:  
    - \`lib/actions/daily-compilations.ts\` (new file)  
      - Exports the above 3 server actions.  
    - \`lib/db.ts\`: If needed to unify DB calls.  
  - **Step Dependencies**: **Step 2**  
  - **User Instructions**:  
    - No special instructions beyond ensuring DB is up to date with the new tables.
</doc>
`

// Function to test the regex pattern
function testRegex() {
  console.log("Testing STEP_REGEX pattern...")

  // Test the regex directly
  STEP_REGEX.lastIndex = 0 // Reset regex state
  let match
  let count = 0

  console.log("\nDirect regex matches:")
  while ((match = STEP_REGEX.exec(sampleDoc)) !== null) {
    count++
    console.log(`Match ${count}:`)
    console.log(`  Checkbox: [${match[1]}]`)
    console.log(`  Step Label: ${match[2]}`)
    console.log(`  Step Number: ${match[3]}`)
    console.log(`  Title: ${match[4]}`)
    console.log(`  Details: ${match[5].substring(0, 50)}...`) // Show first 50 chars of details
  }

  if (count === 0) {
    console.log("No matches found with the regex pattern!")
  }

  // Test a modified regex to see if we can identify the issue
  console.log("\nTesting with a modified regex pattern:")
  const modifiedRegex =
    /- \[([xX ])\] \*\*Step (\d+): ([^*]+?)\*\*\s+([\s\S]+?)(?=\n- \[|$)/g

  let modMatch
  let modCount = 0

  while ((modMatch = modifiedRegex.exec(sampleDoc)) !== null) {
    modCount++
    console.log(`Modified Match ${modCount}:`)
    console.log(`  Checkbox: [${modMatch[1]}]`)
    console.log(`  Step Number: ${modMatch[2]}`)
    console.log(`  Title: ${modMatch[3]}`)
    console.log(`  Details: ${modMatch[4].substring(0, 50)}...`)
  }

  if (modCount === 0) {
    console.log("No matches found with the modified regex pattern either!")
  }

  // Analyze the document structure
  console.log("\nAnalyzing document structure:")
  const lines = sampleDoc.split("\n")
  for (let i = 0; i < Math.min(lines.length, 30); i++) {
    if (lines[i].includes("Step")) {
      console.log(`Line ${i + 1}: ${lines[i]}`)
    }
  }
}

// Run the test
testRegex()

// Let's also try to extract steps using the function
console.log("\nTrying to extract steps using extractImplementationSteps:")
try {
  const steps = extractImplementationSteps(sampleDoc)
  console.log(`Extracted ${steps.length} steps:`)
  steps.forEach(step => {
    console.log(`Step ${step.id}: ${step.title} (Completed: ${step.completed})`)
  })
} catch (error) {
  console.error("Error extracting steps:", error)
}
