import mongoose, { type Document, type Model } from "mongoose";

type BlogSection = {
  heading: string;
  paragraphs: string[];
};

const { model, models, Schema } = mongoose;

export interface BlogRecord extends Document {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  publishedAt: Date;
  image: string;
  imageAlt: string;
  isFeatured: boolean;
  isPublished: boolean;
  content: BlogSection[];
  createdAt: Date;
  updatedAt: Date;
}

const blogSectionSchema = new Schema<BlogSection>(
  {
    heading: { type: String, required: true, trim: true },
    paragraphs: {
      type: [{ type: String, required: true, trim: true }],
      required: true,
    },
  },
  { _id: false },
);

const blogSchema = new Schema<BlogRecord>(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true, maxlength: 180 },
    excerpt: { type: String, required: true, trim: true, maxlength: 300 },
    category: { type: String, required: true, trim: true, maxlength: 80 },
    author: { type: String, required: true, trim: true, maxlength: 80 },
    publishedAt: { type: Date, required: true },
    image: { type: String, required: true, trim: true },
    imageAlt: { type: String, required: true, trim: true, maxlength: 180 },
    isFeatured: { type: Boolean, default: false, required: true },
    isPublished: { type: Boolean, default: true, required: true },
    content: { type: [blogSectionSchema], required: true },
  },
  { timestamps: true, versionKey: false },
);

blogSchema.index({ isPublished: 1, publishedAt: -1 });
blogSchema.index({ isPublished: 1, isFeatured: 1, publishedAt: -1 });

export const BlogModel =
  (models.Blog as Model<BlogRecord> | undefined) ??
  model<BlogRecord>("Blog", blogSchema);
