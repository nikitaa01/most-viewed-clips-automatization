import { eq } from "drizzle-orm";
import { db } from "../lib/db";
import { gamesTable } from "../lib/db/schema";
import { env } from "../utils/env";

export async function getGameId(): Promise<string> {
  console.log("[get-game-id] Getting game id...");
  const gameIdQuery = await db
    .select({ twitchGameId: gamesTable.twitchGameId })
    .from(gamesTable)
    .where(eq(gamesTable.name, env.GAME_NAME))
    .limit(1);

  const firstGame = gameIdQuery[0];

  if (!firstGame) {
    console.error(`[fetch-clips] Game ${env.GAME_NAME} not found`);
    process.exit(1);
  }

  console.log(`[get-game-id] Game id: ${firstGame.twitchGameId}`);
  return firstGame.twitchGameId;
}
