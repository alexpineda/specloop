import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"

export const settingsTable = sqliteTable("settings", {
  /**
   * Optional name for the project.
   * Users can rename their projects for better organization.
   */
  settings: text("settings", { mode: "json" })
    .notNull()
    .$defaultFn(() => ({})),

  /**
   * Creation timestamp, defaults to 'now' at row insertion.
   */
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull()
    .primaryKey(),

  /**
   * Update timestamp, defaults to 'now' and auto-updates when row changes.
   */
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull()
})

/**
 * InsertSettings: Type used for inserting new rows into settings.
 */
export type InsertSettings = typeof settingsTable.$inferInsert

/**
 * SelectSettings: Type used for selecting rows from settings.
 */
export type SelectSettings = typeof settingsTable.$inferSelect
