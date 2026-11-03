import { MongoClient } from "mongodb";
import { readFile } from "node:fs/promises";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is required to seed projects.");
}

const { projects } = JSON.parse(
  await readFile(new URL("../data/projects.json", import.meta.url), "utf8"),
);
const client = new MongoClient(uri);

try {
  await client.connect();
  const collection = client.db().collection("projects");
  const operations = projects.map((project) => ({
    updateOne: {
      filter: { slug: project.slug.replace(/^\/project\//, "") },
      update: {
        $set: {
          ...project,
          slug: project.slug.replace(/^\/project\//, ""),
        },
      },
      upsert: true,
    },
  }));
  const result = await collection.bulkWrite(operations, { ordered: true });

  console.log(
    `Seeded ${result.upsertedCount} new projects and updated ${result.modifiedCount} existing projects.`,
  );
} finally {
  await client.close();
}
