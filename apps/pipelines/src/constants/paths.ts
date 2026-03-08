import { join } from "node:path";

export const ROOT = process.cwd();
export const TEMP_DIR = join(ROOT, "temp");
export const CLIPS_PATH = join(TEMP_DIR, "clips.json");
export const CLIPS_DIR_PATH = join(TEMP_DIR, "clips");
export const NORMALIZED_CLIPS_DIR_PATH = join(TEMP_DIR, "normalized");
export const CLIPS_AUDIO_DIR_PATH = join(TEMP_DIR, "clips-audio");
export const MOST_VIEWED_CLIP_THUMBNAIL_PATH = join(
  TEMP_DIR,
  "most-viewed-clip-thumbnail.jpg",
);

export const STATIC_DIR_PATH = join(TEMP_DIR, "static");
export const INTRO_PATH = join(STATIC_DIR_PATH, "intro.mp4");
export const OUTRO_PATH = join(STATIC_DIR_PATH, "outro.mp4");
export const THUMBNAIL_PATH = join(STATIC_DIR_PATH, "thumbnail.webp");

export const FINAL_THUMBNAIL_PATH = join(TEMP_DIR, "final-thumbnail.webp");
