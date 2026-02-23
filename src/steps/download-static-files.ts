import { INTRO_PATH, OUTRO_PATH, THUMBNAIL_PATH } from "@/constants/paths";
import { fetchFile, s3Client } from "@/lib/s3";
import { env } from "@/utils/env";

export async function downloadStaticFiles(): Promise<void> {
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
}
