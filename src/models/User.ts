import mongoose, { Schema, Document, Model } from "mongoose";

export interface UserDocument extends Document {
  email: string;
  name?: string;
  image?: string;
  bookmarks: string[];
  schedule: string[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
    },
    image: {
      type: String,
    },
    bookmarks: {
      type: [String],
      default: [],
    },
    schedule: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export const User: Model<UserDocument> =
  mongoose.models.User ||
  mongoose.model<UserDocument>("User", userSchema, "users");
