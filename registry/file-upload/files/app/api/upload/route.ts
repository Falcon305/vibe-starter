import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireSession } from "@/lib/auth/guard";
import { env } from "@/lib/env";
import { s3 } from "@/lib/storage/s3";

const allowedTypes = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "application/pdf",
]);

const schema = z.object({
  filename: z.string().min(1).max(200),
  contentType: z.string().min(1).max(100),
});

export async function POST(request: Request) {
  await requireSession();

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  if (!allowedTypes.has(parsed.data.contentType)) {
    return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
  }

  const safeName = parsed.data.filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  const key = `uploads/${crypto.randomUUID()}-${safeName}`;
  const command = new PutObjectCommand({
    Bucket: env.S3_BUCKET,
    Key: key,
    ContentType: parsed.data.contentType,
  });
  const url = await getSignedUrl(s3, command, { expiresIn: 60 });

  return NextResponse.json({ url, key });
}
