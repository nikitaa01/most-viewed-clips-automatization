import { createStep } from "@/utils/create-step";
import { $ } from "bun";
import { join } from "node:path";
import { CLIPS_DIR_PATH } from "../constants/paths";
import type { Clip } from "../types/clip";
import { concurrentPool } from "../utils/concurrent-pool";

export const downloadClipsStep = createStep({
  step: "download-clips",
  stepFunction: async (clips: Clip[]) => {
    await $`mkdir -p ${CLIPS_DIR_PATH}`;

    console.log("[download-clips] Downloading clips...");

    const results = await concurrentPool(
      clips,
      async (clip) => {
        const outPath = join(CLIPS_DIR_PATH, `${clip.id}.mp4`);
        await $`yt-dlp "${clip.url}" -f "best[ext=mp4]" -o "${outPath}"`;
        return outPath;
      },
      { concurrency: 5 },
    );

    const successfulPaths = results
      .filter(
        (r): r is PromiseFulfilledResult<string> => r.status === "fulfilled",
      )
      .map((r) => r.value);

    for (const r of results) {
      if (r.status === "rejected") {
        const index = results.indexOf(r);
        console.error(`[download] Failed for ${clips[index]?.id}:`, r.reason);
      }
    }

    console.log(
      `[download] ${successfulPaths.length} clips ready in ${CLIPS_DIR_PATH}`,
    );

    return successfulPaths;
  },
});
