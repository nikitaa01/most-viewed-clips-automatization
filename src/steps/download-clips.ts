import { $ } from "bun";
import { join } from "node:path";
import { CLIPS_DIR_PATH } from "../constants/paths";
import type { Clip } from "../types/clip";

export async function downloadClips(clips: Clip[]): Promise<string[]> {
  await $`mkdir -p ${CLIPS_DIR_PATH}`;

  const successfulPaths: string[] = [];

  console.log("[download-clips] Downloading clips...");

  for (const [index, clip] of clips.entries()) {
    const outPath = join(CLIPS_DIR_PATH, `${clip.id}.mp4`);
    try {
      await $`yt-dlp "${clip.url}" -f "best[ext=mp4]" -o "${outPath}"`;
      console.log(`[download] ${index + 1}/${clips.length} - Done: ${clip.id}`);
      successfulPaths.push(outPath);
    } catch (err) {
      console.error(`[download] Failed for ${clip.id}:`, err);
    }
  }

  console.log(
    `[download] ${successfulPaths.length} clips ready in ${CLIPS_DIR_PATH}`,
  );

  return successfulPaths;
}
