import "server-only";
import mongoose from "mongoose";
import { getServerEnv } from "@/lib/env";

type MongooseCache = {
  connection: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cache = (globalThis.mongooseCache ??= {
  connection: null,
  promise: null,
});

export async function connectToDatabase() {
  if (cache.connection) {
    return cache.connection;
  }

  const { MONGODB_URI } = getServerEnv();

  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGODB_URI).catch((error: unknown) => {
      cache.promise = null;
      throw error;
    });
  }

  cache.connection = await cache.promise;
  return cache.connection;
}
