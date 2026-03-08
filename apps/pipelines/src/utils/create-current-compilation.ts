import { compilationsTable, db } from "@repo/database";

export async function createCurrentCompilation(gameId: string) {
  console.log("[create-current-compilation] Creating current compilation...");
  const [compilation] = await db
    .insert(compilationsTable)
    .values({
      gameId,
    })
    .returning();
  if (!compilation) {
    throw new Error(
      "[create-current-compilation] Failed to create compilation",
    );
  }
  console.log(
    `[create-current-compilation] Created compilation: ${compilation.id}`,
  );
  return compilation;
}
