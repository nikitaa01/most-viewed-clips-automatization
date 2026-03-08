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
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  return Buffer.concat(chunks);
};
