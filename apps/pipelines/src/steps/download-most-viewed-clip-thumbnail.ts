import { MOST_VIEWED_CLIP_THUMBNAIL_PATH } from "@/constants/paths";
import type { Clip } from "@/types/clip";
import { createStep } from "@/utils/create-step";

export const downloadMostViewedClipThumbnailStep = createStep({
  step: "download-most-viewed-clip-thumbnail",
  stepFunction: async (clip: Clip | undefined) => {
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
  },
});
