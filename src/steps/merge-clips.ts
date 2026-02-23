import { $ } from "bun";
import { join } from "node:path";
import { TEMP_DIR } from "../constants/paths";

export async function mergeClips(successfulPaths: string[]): Promise<void> {
  if (successfulPaths.length === 0) {
    console.error("[merge] No clips ready, skipping merge.");
    return;
  }

  console.log("[merge-clips] Merging clips...");

  const inputs = successfulPaths.flatMap((p) => ["-i", p]);

  const filterInputs = successfulPaths
    .map(
      (_, i) =>
        `[${i}:v]scale=2560:1440:force_original_aspect_ratio=decrease:flags=lanczos,pad=2560:1440:(ow-iw)/2:(oh-ih)/2,setsar=1,format=yuv420p[v${i}]; [${i}:a]aresample=48000,aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo[a${i}];`,
    )
    .join(" ");

  const concatSegments = successfulPaths
    .map((_, i) => `[v${i}][a${i}]`)
    .join("");

  const fullFilter = `${filterInputs}${concatSegments}concat=n=${successfulPaths.length}:v=1:a=1[v][a]`;

  await $`ffmpeg ${inputs} -filter_complex ${fullFilter} -map "[v]" -map "[a]" -c:v libx264 -crf 17 -preset slow -vsync 2 -movflags +faststart ${join(TEMP_DIR, "result.mp4")}`;
  console.log("[merge-clips] Merge done.");
}
