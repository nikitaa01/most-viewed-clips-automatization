import {
  INTRO_PATH,
  OUTRO_PATH,
  STATIC_DIR_PATH,
  THUMBNAIL_PATH,
} from "@/constants/paths";
import { fetchFile, s3Client } from "@/lib/s3";
import { createStep } from "@/utils/create-step";
import { env } from "@/utils/env";
import { $ } from "bun";

export const downloadStaticFilesStep = createStep({
  step: "download-static-files",
  stepFunction: async () => {
    await $`mkdir -p ${STATIC_DIR_PATH}`;

    console.log("[download-static-files] Downloading static files...");

    const [introBuffer, outroBuffer, thumbnailBuffer] = await Promise.all([
      fetchFile(s3Client.file(env.BUCKET_INTRO_PATH)),
      fetchFile(s3Client.file(env.BUCKET_OUTRO_PATH)),
      fetchFile(s3Client.file(env.BUCKET_THUMBNAIL_PATH)),
    ]);

    await Bun.write(INTRO_PATH, introBuffer);
    await Bun.write(OUTRO_PATH, outroBuffer);
    await Bun.write(THUMBNAIL_PATH, thumbnailBuffer);
    console.log("[download-static-files] Done");
  },
});
