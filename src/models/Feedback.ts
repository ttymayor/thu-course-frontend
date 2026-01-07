import mongoose, { Schema, Document, Model } from "mongoose";

export interface FeedbackDocument extends Document {
  user_email_or_anonymous: string | null;
  type: "bug" | "feature" | "other";
  subject: string;
  message: string;
  is_anonymous: boolean;
  status: "pending" | "in_progress" | "resolved" | "closed";
  createdAt: Date;
  updatedAt: Date;
}

const feedbackSchema = new Schema<FeedbackDocument>(
  {
    user_email_or_anonymous: {
      type: String,
      default: "Anonymous",
      required: false,
    },
    type: {
      type: String,
      enum: ["bug", "feature", "other"],
      required: true,
    },
    subject: {
      type: String,
      required: true,
      maxlength: 200,
    },
    message: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    status: {
      type: String,
      enum: ["pending", "in_progress", "resolved", "closed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

export const Feedback: Model<FeedbackDocument> =
  mongoose.models.Feedback ||
  mongoose.model<FeedbackDocument>("Feedback", feedbackSchema, "feedbacks");
