import { db, gamesTable } from "@repo/database";

await db.insert(gamesTable).values([
  {
    name: "overwatch",
    twitchGameId: "515025",
  },
]);
