import mongoose from "mongoose";
import blogsData from "../data/blogs.json" with { type: "json" };
import { BlogModel } from "../features/blogs/blog.model.ts";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is required to seed blog posts.");
}

try {
  await mongoose.connect(uri);

  const result = await BlogModel.bulkWrite(
    blogsData.blogs.map((blog) => ({
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
    })),
    { ordered: true },
  );

  console.log(
    `Seeded ${result.upsertedCount} new blog posts and updated ${result.modifiedCount} existing blog posts.`,
  );
} finally {
  await mongoose.disconnect();
}
