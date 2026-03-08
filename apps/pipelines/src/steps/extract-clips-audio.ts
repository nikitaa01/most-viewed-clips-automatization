import { createStep } from "@/utils/create-step";
import { $ } from "bun";
import { basename, join } from "node:path";
import { CLIPS_AUDIO_DIR_PATH } from "../constants/paths";

export const extractClipsAudioStep = createStep({
  step: "extract-clips-audio",
  stepFunction: async (inputPaths: string[]) => {
    if (inputPaths.length === 0) {
      console.error("[extract-audio] No clips to process.");
      return [];
    }

    await $`mkdir -p ${CLIPS_AUDIO_DIR_PATH}`;
    console.log("[extract-audio] Extracting audio to M4A...");

    const successfulPaths: string[] = [];

    for (const [index, inputPath] of inputPaths.entries()) {
      const base = basename(inputPath, ".mp4");
      const outputPath = join(CLIPS_AUDIO_DIR_PATH, `${base}.m4a`);
      try {
        await $`ffmpeg -i ${inputPath} -vn -c:a aac -b:a 192k -y ${outputPath}`;
        successfulPaths.push(outputPath);
        console.log(
          `[extract-audio] ${index + 1}/${inputPaths.length} - Done: ${base}.m4a`,
        );
      } catch (err) {
        console.error(`[extract-audio] Failed for ${inputPath}:`, err);
      }
    }

    console.log(
      `[extract-audio] ${successfulPaths.length} audio files in ${CLIPS_AUDIO_DIR_PATH}`,
    );
    return successfulPaths;
  },
});
