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
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
});
