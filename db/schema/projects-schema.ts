import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"

/**
 * projectsTable: The main table storing project records.
 * Each project belongs to a specific user and tracks when it was created and updated.
 */
export const projectsTable = sqliteTable("projects", {
  /**
   * Unique primary key for the project.
   * Using text to store UUID string.
   */
  id: text("id")
    .$defaultFn(() => crypto.randomUUID())
    .primaryKey(),

  /**
   * Optional name for the project.
   * Users can rename their projects for better organization.
   */
  name: text("name"),

  /**
   * A short summary of the project. For display on the dashboard list.
   */
  projectShortSummary: text("project_short_summary"),

  /**
   * The initial idea request:
   */
  ideaRequest: text("idea"),

  /**
   * manual or auto.
   */
  ideaRequestLastUpdateType: text("idea_request_last_update_type"),

  /**
   * The final specification generated (Markdown or text).
   * Null by default until the user decides to generate and store it.
   */
  spec: text("spec"),

  /**
   * The final implementation plan generated after the spec is done.
   * Null by default until the user decides to generate and store it.
   */
  implementationPlan: text("implementation_plan"),

  /**
   * The user may paste or upload an existing code snippet here.
   * Null by default.
   */
  existingCode: text("existing_code"),

  /**
   * The user-provided "Project Rules" that the AI should consider
   * when generating the specification.
   */
  projectRules: text("project_rules"),

  /**
   * The user-provided "Starter Template" or initial code scaffolding
   * that the AI wants the AI to factor in for the final code generation.
   */
  starterTemplate: text("starter_template"),

  /**
   * NEW: The last-generated code snippet from the Code Generation stage.
   * We store it here to display after a transitional route.
   */
  lastGeneratedCode: text("last_generated_code"),

  /**
   * NEW: The additional documents that the user may upload or paste here.
   * These are not used for anything yet, but we store them for future reference.
   */
  additionalDocuments: text("additional_documents"),

  /**
   * Creation timestamp, defaults to 'now' at row insertion.
   */
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),

  /**
   * Update timestamp, defaults to 'now' and auto-updates when row changes.
   */
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull()
})

/**
 * InsertProject: Type used for inserting new rows into projects.
 */
export type InsertProject = typeof projectsTable.$inferInsert

/**
 * SelectProject: Type used for selecting rows from projects.
 */
export type SelectProject = typeof projectsTable.$inferSelect
