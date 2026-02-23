import { env } from "@/utils/env";
import { S3Client, type S3File } from "bun";

export const s3Client = new S3Client({
  accessKeyId: env.BUCKET_ACCESS_KEY_ID,
  secretAccessKey: env.BUCKET_SECRET_ACCESS_KEY,
  endpoint: env.BUCKET_ENDPOINT,
  bucket: env.BUCKET_NAME,
});

export const fetchFile = async (file: S3File) => {
  const stream = file.stream();
  const chunks: Uint8Array[] = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
};
