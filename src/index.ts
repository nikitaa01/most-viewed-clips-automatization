import { $ } from "bun";
import { TEMP_DIR } from "./constants/paths";
import { downloadClips } from "./steps/download-clips";
import { downloadMostViewedClipThumbnail } from "./steps/download-most-viewed-clip-thumbnail";
import { downloadStaticFiles } from "./steps/download-static-files";
import { fetchClips } from "./steps/fetch-clips";
import { generateThumbnail } from "./steps/generate-thumbnail";
import { getGameId } from "./steps/get-game-id";
import { mergeClips } from "./steps/merge-clips";

await $`mkdir -p ${TEMP_DIR}`;

const gameId = await getGameId();
const clips = await fetchClips(gameId);
if (!clips[0]) {
  throw new Error("No clips found");
}
await downloadMostViewedClipThumbnail(clips[0]);
await downloadStaticFiles();
await generateThumbnail();
const paths = await downloadClips(clips);
await mergeClips(paths);
