import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"
import { projectsTable } from "./projects-schema"

/**
 * messagesTable: The main table storing individual messages tied to a chat session.
 */
export const messagesTable = sqliteTable("messages", {
  /**
   * Unique primary key for the message.
   * Using text to store UUID string.
   */
  id: text("id")
    .$defaultFn(() => crypto.randomUUID())
    .primaryKey(),

  /**
   * The document that the message belongs to.
   * 'idea_request', 'spec', 'implementationPlan', 'projectRules', 'starterTemplate'
   */
  // document: text("document").notNull(),

  /**
   * Foreign key referencing the chat session this message belongs to.
   * We cascade delete, so removing the parent chat session
   * also removes all associated messages.
   */
  chatId: text("chat_id")
    .references(() => projectsTable.id, {
      onDelete: "cascade"
    })
    .notNull(),

  /**
   * The text content of the message.
   */
  content: text("content").notNull(),

  /**
   * The role of the message (assistant or user).
   * In SQLite we use text instead of enum
   */
  role: text("role", { enum: ["assistant", "user"] }).notNull(),

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
 * InsertMessage: Type used for inserting new rows into messages.
 */
export type InsertMessage = typeof messagesTable.$inferInsert

/**
 * SelectMessage: Type used for selecting rows from messages.
 */
export type SelectMessage = typeof messagesTable.$inferSelect
