/*
Initializes the database connection and schema for the app.
*/

import { projectsTable } from "@/db/schema/projects-schema"
import { messagesTable } from "@/db/schema/messages-schema"
import { settingsTable } from "@/db/schema/settings-schema"
import { config } from "dotenv"
import { drizzle } from "drizzle-orm/libsql"
import { createClient } from "@libsql/client"

/**
 * Load environment variables from .env.local
 */
config({ path: ".env.local" })

/**
 * Define the Drizzle schema object for type-safe DB access.
 */
const schema = {
  projects: projectsTable,
  messages: messagesTable,
  settings: settingsTable
}

/**
 * Default SQLite database file path
 */
const DEFAULT_DB_PATH = "file:./specloop.db"

/**
 * Create a libSQL client with proper error handling
 */
const client = createClient({
  url: process.env.DATABASE_URL ?? DEFAULT_DB_PATH
})

/**
 * Export a Drizzle instance that is bound to this schema.
 */
export const db = drizzle(client, {
  schema
})
