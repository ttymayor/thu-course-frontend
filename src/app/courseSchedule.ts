import mongoose from "mongoose";
import connectMongoDB from "./mongodbConnection";

const courseScheduleSchema = new mongoose.Schema({
  course_stage: String,
  status: String,
  start_time: String,
  end_time: String,
  result_publish_time: Array,
});

const CourseSchedule =
  mongoose.models.CourseSchedule ||
  mongoose.model("CourseSchedule", courseScheduleSchema, "course_schedule");

export async function getCourseSchedules() {
  await connectMongoDB();
  const schedules = await CourseSchedule.find({});
  return schedules;
}
