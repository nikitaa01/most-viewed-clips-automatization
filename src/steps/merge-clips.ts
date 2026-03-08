import { $ } from "bun";
import { join } from "node:path";
import { TEMP_DIR } from "../constants/paths";

export async function mergeClips(successfulPaths: string[]): Promise<void> {
  if (successfulPaths.length === 0) {
    console.error("[merge] No clips ready, skipping merge.");
    return;
  }

  console.log("[merge-clips] Merging clips (concat, no re-encode)...");

  const concatListPath = join(TEMP_DIR, "concat-list.txt");
  const listContent = successfulPaths
    .map((p) => `file '${p.replace(/'/g, "'\\''")}'`)
    .join("\n");

  await Bun.write(concatListPath, listContent);

  await $`ffmpeg -f concat -safe 0 -i ${concatListPath} -c copy -movflags +faststart -y ${join(TEMP_DIR, "result.mp4")}`;
  console.log("[merge-clips] Merge done.");
}
