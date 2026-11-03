import { MongoClient } from "mongodb";
import { readFile } from "node:fs/promises";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is required to seed blog posts.");
}

const { blogs } = JSON.parse(
  await readFile(new URL("../data/blogs.json", import.meta.url), "utf8"),
);
const client = new MongoClient(uri);

try {
  await client.connect();
  const collection = client.db().collection("blogs");
  const operations = blogs.map((blog) => ({
    updateOne: {
      filter: { slug: blog.slug },
      update: {
        $set: {
          ...blog,
          publishedAt: new Date(blog.publishedAt),
        },
      },
      upsert: true,
    },
  }));
  const result = await collection.bulkWrite(operations, { ordered: true });

  console.log(
    `Seeded ${result.upsertedCount} new blog posts and updated ${result.modifiedCount} existing blog posts.`,
  );
} finally {
  await client.close();
}
