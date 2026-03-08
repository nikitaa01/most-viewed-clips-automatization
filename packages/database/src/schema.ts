import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const gamesTable = sqliteTable("games", {
  name: text("name").notNull().primaryKey(),
  twitchGameId: text("twitch_game_id").notNull().unique(),
});

export const compilationsTable = sqliteTable("compilations", {
  id: integer("id").primaryKey(),
  gameId: text("game_id")
    .notNull()
    .references(() => gamesTable.name),
  status: text("status", {
    enum: ["pending", "completed", "failed"],
  })
    .notNull()
    .default("pending"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
});

export const clipsTable = sqliteTable("clips", {
  id: integer("id").primaryKey(),
  compilationId: text("compilation_id")
    .notNull()
    .references(() => compilationsTable.id),
  clipId: text("clip_id").notNull(),
  clipUrl: text("clip_url").notNull(),
  status: text("status", {
    enum: ["pending", "rejected", "accepted", "rejected-by-ai-analysis"],
  })
    .notNull()
    .default("pending"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
});

export const pipeStepsStatusTable = sqliteTable("pipe_steps", {
  id: integer("id").primaryKey(),
  step: text("step").notNull(),
  status: text("status", {
    enum: ["running", "completed", "failed"],
  }).notNull(),
  compilationId: text("compilation_id")
    .notNull()
    .references(() => compilationsTable.id),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
});

export const logsTable = sqliteTable("logs", {
  id: integer("id").primaryKey(),
  compilationId: text("compilation_id")
    .notNull()
    .references(() => compilationsTable.id),
  stepStatusId: integer("step_status_id")
    .notNull()
    .references(() => pipeStepsStatusTable.id),
  message: text("message").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
});
