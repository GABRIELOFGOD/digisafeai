import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db/mongoose";

const { GridFSBucket, ObjectId } = mongoose.mongo;
type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = await params;
  if (!ObjectId.isValid(id)) {
    return new Response("Image not found.", { status: 404 });
  }

  try {
    const connection = await connectToDatabase();
    const db = connection.connection.db;
    if (!db) throw new Error("DATABASE_NOT_CONNECTED");

    const objectId = new ObjectId(id);
    const bucket = new GridFSBucket(db, { bucketName: "contentImages" });
    const file = await bucket.find({ _id: objectId }).next();
    const contentType = file?.metadata?.contentType;
    if (
      !file ||
      typeof contentType !== "string" ||
      !["image/jpeg", "image/png", "image/webp"].includes(contentType)
    ) {
      return new Response("Image not found.", { status: 404 });
    }

    const download = bucket.openDownloadStream(objectId);
    const body = new ReadableStream<Uint8Array>({
      start(controller) {
        download.on("data", (chunk: Buffer) => {
          controller.enqueue(new Uint8Array(chunk));
        });
        download.once("end", () => controller.close());
        download.once("error", (error: Error) => controller.error(error));
      },
      cancel() {
        download.destroy();
      },
    });

    return new Response(body, {
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(file.length),
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error(
      "Content image could not be retrieved.",
      error instanceof Error ? error.name : "UnknownError",
    );
    return new Response("Image temporarily unavailable.", { status: 503 });
  }
}
