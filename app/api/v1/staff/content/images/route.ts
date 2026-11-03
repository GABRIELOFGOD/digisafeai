import mongoose from "mongoose";
import { getAdminSession } from "@/lib/auth/admin-session";
import { connectToDatabase } from "@/lib/db/mongoose";
import { isTrustedSameOrigin } from "@/lib/security/same-origin";

const { GridFSBucket, ObjectId } = mongoose.mongo;
const maximumImageSize = 5 * 1024 * 1024;
const maximumRequestSize = maximumImageSize + 64 * 1024;
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

async function readRequestBody(request: Request) {
  if (!request.body) return null;

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalSize = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    totalSize += value.byteLength;
    if (totalSize > maximumRequestSize) {
      await reader.cancel();
      return null;
    }

    chunks.push(value);
  }

  const body = new Uint8Array(totalSize);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return body;
}

function getImageType(bytes: Uint8Array) {
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return "image/png";
  }

  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "image/jpeg";
  }

  if (
    bytes.length >= 12 &&
    String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
    String.fromCharCode(...bytes.slice(8, 12)) === "WEBP"
  ) {
    return "image/webp";
  }

  return null;
}

export async function POST(request: Request) {
  if (!isTrustedSameOrigin(request)) {
    return Response.json({ error: "Request origin was not accepted." }, { status: 403 });
  }

  const session = await getAdminSession(request.headers);
  if (!session) {
    return Response.json({ error: "Administrator access required." }, { status: 403 });
  }

  const contentLength = request.headers.get("content-length");
  const declaredLength = contentLength === null ? null : Number(contentLength);
  if (declaredLength !== null && !Number.isSafeInteger(declaredLength)) {
    return Response.json({ error: "Invalid image upload request." }, { status: 400 });
  }
  if (declaredLength !== null && declaredLength > maximumRequestSize) {
    return Response.json({ error: "Images must be 5 MB or smaller." }, { status: 413 });
  }

  let formData: FormData;
  try {
    const body = await readRequestBody(request);
    if (!body) {
      return Response.json({ error: "Images must be 5 MB or smaller." }, { status: 413 });
    }
    formData = await new Request(request.url, {
      method: "POST",
      headers: request.headers,
      body,
    }).formData();
  } catch {
    return Response.json({ error: "Choose an image to upload." }, { status: 400 });
  }

  const file = formData.get("image");
  if (!(file instanceof File) || file.size === 0) {
    return Response.json({ error: "Choose an image to upload." }, { status: 400 });
  }
  if (file.size > maximumImageSize) {
    return Response.json({ error: "Images must be 5 MB or smaller." }, { status: 413 });
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const detectedType = getImageType(bytes);
  if (!detectedType || !allowedTypes.has(file.type) || detectedType !== file.type) {
    return Response.json(
      { error: "Upload a valid JPEG, PNG, or WebP image." },
      { status: 415 },
    );
  }

  try {
    const connection = await connectToDatabase();
    const db = connection.connection.db;
    if (!db) throw new Error("DATABASE_NOT_CONNECTED");

    const id = new ObjectId();
    const bucket = new GridFSBucket(db, { bucketName: "contentImages" });
    const upload = bucket.openUploadStream(id.toHexString(), {
      id,
      metadata: {
        contentType: detectedType,
        uploadedBy: session.user.id,
        originalName: file.name.slice(0, 160),
      },
    });

    await new Promise<void>((resolve, reject) => {
      upload.once("finish", resolve);
      upload.once("error", reject);
      upload.end(bytes);
    });

    return Response.json(
      { image: `/api/v1/content-images/${id.toHexString()}` },
      { status: 201 },
    );
  } catch (error) {
    console.error(
      "Content image upload failed.",
      error instanceof Error ? error.name : "UnknownError",
    );
    return Response.json(
      { error: "The image could not be uploaded. Please try again." },
      { status: 503 },
    );
  }
}
