import mongoose, { type Document, type Model, Schema } from "mongoose";

import { getCollectionName } from "@/lib/collectionName";

export interface CourseScheduleDocument extends Document {
  course_stage?: string;
  status?: string;
  start_time?: string;
  end_time?: string;
  result_publish_time?: string | string[];
}

const courseScheduleSchema = new Schema<CourseScheduleDocument>({
  course_stage: String,
  status: String,
  start_time: String,
  end_time: String,
  result_publish_time: Schema.Types.Mixed,
});

export const CourseScheduleModel: Model<CourseScheduleDocument> =
  mongoose.models.CourseSchedule ||
  mongoose.model<CourseScheduleDocument>(
    "CourseSchedule",
    courseScheduleSchema,
    getCollectionName("course_schedule"),
  );
