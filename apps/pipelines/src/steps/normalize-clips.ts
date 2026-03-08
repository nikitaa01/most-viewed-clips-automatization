import { $ } from "bun";
import { basename, join } from "node:path";
import { NORMALIZED_CLIPS_DIR_PATH } from "../constants/paths";

const TARGET_FPS = 30;
const VIDEO_FILTER = `scale=2560:1440:force_original_aspect_ratio=decrease,pad=2560:1440:(ow-iw)/2:(oh-ih)/2,setsar=1,fps=${TARGET_FPS},format=yuv420p`;
const AUDIO_FILTER =
  "aresample=48000,aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo";

export async function normalizeClip(
  inputPath: string,
  outputPath: string,
): Promise<void> {
  await $`ffmpeg -i ${inputPath} -vf ${VIDEO_FILTER} -af ${AUDIO_FILTER} -c:v libx264 -preset slow -crf 17 -profile:v high -level:v 4.2 -c:a aac -b:a 320k -movflags +faststart -y ${outputPath}`;
}

export async function normalizeClips(inputPaths: string[]): Promise<string[]> {
  if (inputPaths.length === 0) {
    console.error("[normalize-clips] No clips to normalize.");
    return [];
  }

  await $`mkdir -p ${NORMALIZED_CLIPS_DIR_PATH}`;
  console.log("[normalize-clips] Normalizing clips to 1440p, 30fps...");

  const successfulPaths: string[] = [];

  for (const [index, inputPath] of inputPaths.entries()) {
    const outputPath = join(NORMALIZED_CLIPS_DIR_PATH, basename(inputPath));
    try {
      await normalizeClip(inputPath, outputPath);
      successfulPaths.push(outputPath);
      console.log(
        `[normalize] ${index + 1}/${inputPaths.length} - Done: ${basename(inputPath)}`,
      );
    } catch (err) {
      console.error(`[normalize] Failed for ${inputPath}:`, err);
    }
  }

  console.log(
    `[normalize-clips] ${successfulPaths.length} clips normalized in ${NORMALIZED_CLIPS_DIR_PATH}`,
  );
  return successfulPaths;
}
