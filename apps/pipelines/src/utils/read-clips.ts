import { TEMP_DIR } from "@/constants/paths";
import { clipsSchema } from "@/types/clip";
import { join } from "node:path";

export async function readClips() {
  const clips = await Bun.file(join(TEMP_DIR, "clips.json")).json();
  const parsed = clipsSchema.parse(clips);
  return parsed.data;
}
