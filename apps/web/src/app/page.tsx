import { db, gamesTable } from "@repo/database";

export default async function Home() {
  const games = await db.select().from(gamesTable);
  return <div>{JSON.stringify(games)}</div>;
}
