import mongoose from "mongoose";
import connectMongoDB from "./mongodb";

const courseInfoSchema = new mongoose.Schema({
  academic_semester: Number,
  academic_year: Number,
  course_code: String,
  course_name: String,
  course_type: Number,
  credits_1: Number,
  credits_2: Number,
  department_code: String,
  department_name: String,
});

const CourseInfo =
  mongoose.models.CourseInfo ||
  mongoose.model("CourseInfo", courseInfoSchema, "course_info");

export async function getCourseInfo(
  filters: {
    code?: string;
    name?: string;
    dept?: string;
    page?: number;
    pageSize?: number;
  } = {}
) {
  await connectMongoDB();

  const { code, name, dept, page = 1, pageSize = 10 } = filters;

  // 建構查詢條件
  const query: any = {};
  if (code) {
    query.course_code = { $regex: code, $options: "i" };
  }
  if (name) {
    query.course_name = { $regex: name, $options: "i" };
  }
  if (dept) {
    query.department_name = { $regex: dept, $options: "i" };
  }

  // 計算總數
  const total = await CourseInfo.countDocuments(query);

  // 分頁查詢
  const skip = (page - 1) * pageSize;
  const data = await CourseInfo.find(query).skip(skip).limit(pageSize).lean(); // 使用 lean() 提升效能

  return { data, total };
}
