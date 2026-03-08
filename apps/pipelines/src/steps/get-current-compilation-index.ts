import { compilationsTable, db } from "@repo/database";
import { eq, sql } from "drizzle-orm";

export async function getCurrentCompilationIndex(
  gameId: string,
): Promise<number> {
  console.log(
    "[get-current-compilation-index] Getting current compilation index...",
  );
  const compilationIndexQuery = await db
    .select({ count: sql`count(1)`.mapWith(Number) })
    .from(compilationsTable)
    .where(eq(compilationsTable.gameId, gameId));

  console.log(
    `[get-current-compilation-index] Current compilation index: ${compilationIndexQuery[0]?.count ?? 0}`,
  );
  return compilationIndexQuery[0]?.count ?? 0;
}
