import mongoose, { Schema, Document, Model } from "mongoose";

export interface TermCourseCodes {
  academic_year: number;
  academic_semester: number;
  course_codes: string[];
}

export interface UserDocument extends Document {
  email: string;
  name?: string;
  image?: string;
  bookmarks: string[];
  schedule: string[];
  bookmark_terms: TermCourseCodes[];
  schedules: TermCourseCodes[];
  createdAt: Date;
  updatedAt: Date;
}

const termCourseCodesSchema = new Schema<TermCourseCodes>(
  {
    academic_year: {
      type: Number,
      required: true,
    },
    academic_semester: {
      type: Number,
      required: true,
    },
    course_codes: {
      type: [String],
      default: [],
    },
  },
  { _id: false },
);

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
    bookmark_terms: {
      type: [termCourseCodesSchema],
      default: [],
    },
    schedules: {
      type: [termCourseCodesSchema],
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
