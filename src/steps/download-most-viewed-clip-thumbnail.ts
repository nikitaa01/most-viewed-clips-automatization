import { MOST_VIEWED_CLIP_THUMBNAIL_PATH } from "@/constants/paths";
import type { Clip } from "@/types/clip";

export async function downloadMostViewedClipThumbnail(
  clip: Clip | undefined,
): Promise<void> {
  if (!clip) {
    throw new Error("[download-most-viewed-clip-thumbnail] No clip found");
  }
  console.log(
    "[download-most-viewed-clip-thumbnail] Downloading most viewed clip thumbnail...",
  );

  const thumbnail = await fetch(clip.thumbnail_url);
  const thumbnailBuffer = await thumbnail.arrayBuffer();
  await Bun.write(MOST_VIEWED_CLIP_THUMBNAIL_PATH, thumbnailBuffer);
  console.log("[download-most-viewed-clip-thumbnail] Done");
}
