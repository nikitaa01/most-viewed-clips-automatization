import {
  FINAL_THUMBNAIL_PATH,
  MOST_VIEWED_CLIP_THUMBNAIL_PATH,
  THUMBNAIL_PATH,
} from "@/constants/paths";
import sharp from "sharp";

export async function generateThumbnail(): Promise<void> {
  console.log("[generate-thumbnail] Generating thumbnail...");
  await sharp(MOST_VIEWED_CLIP_THUMBNAIL_PATH)
    .resize(1280, 720)
    .composite([
      {
        input: THUMBNAIL_PATH,
        top: 0,
        left: 0,
      },
    ])
    .toFile(FINAL_THUMBNAIL_PATH);
  console.log("[generate-thumbnail] Done");
}
