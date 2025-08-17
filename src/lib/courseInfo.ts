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

interface CourseInfoQuery {
  course_code?: string | { $regex: string; $options: string };
  course_name?: string | { $regex: string; $options: string };
  department_code?: string | { $regex: string; $options: string };
  department_name?: string | { $regex: string; $options: string };
  academic_semester?: string | number;
  academic_year?: string | number;
  $or?: Array<{
    course_code?: { $regex: string; $options: string };
    course_name?: { $regex: string; $options: string };
    department_code?: { $regex: string; $options: string };
  }>;
}

export async function getCourseInfo(
  filters: {
    course_code?: string;
    course_name?: string;
    department_code?: string;
    department_name?: string;
    academic_semester?: string;
    academic_year?: string;
    page?: number;
    page_size?: number;
  } = {}
) {
  await connectMongoDB();

  const {
    course_code,
    course_name,
    department_code,
    department_name,
    academic_semester,
    academic_year,
    page = 1,
    page_size = 10,
  } = filters;

  // 建構查詢條件
  const query: CourseInfoQuery = {};

  // 如果department_code被明確指定且與其他搜尋參數不同，直接作為篩選條件
  const isDeptFilter =
    department_code &&
    department_code !== course_code &&
    department_code !== course_name;

  if (isDeptFilter) {
    // 系所篩選模式
    query.department_code = { $regex: department_code, $options: "i" };

    // 在特定系所內搜尋課程
    if (course_code && course_name && course_code === course_name) {
      query.$or = [
        { course_code: { $regex: course_code, $options: "i" } },
        { course_name: { $regex: course_code, $options: "i" } },
      ];
    } else {
      if (course_code) {
        query.course_code = { $regex: course_code, $options: "i" };
      }
      if (course_name && course_name !== course_code) {
        query.course_name = { $regex: course_name, $options: "i" };
      }
    }
  } else {
    // 統一搜尋模式
    const isUnifiedSearch =
      course_code === course_name &&
      course_name === department_code &&
      course_code;

    if (isUnifiedSearch) {
      // 統一搜尋：在課程代碼、課程名稱、系所代碼中任一匹配即可
      query.$or = [
        { course_code: { $regex: course_code, $options: "i" } },
        { course_name: { $regex: course_code, $options: "i" } },
        { department_code: { $regex: course_code, $options: "i" } },
      ];
    } else {
      // 分別搜尋
      if (course_code) {
        query.course_code = { $regex: course_code, $options: "i" };
      }
      if (course_name && course_name !== course_code) {
        query.course_name = { $regex: course_name, $options: "i" };
      }
      if (
        department_code &&
        department_code !== course_code &&
        department_code !== course_name
      ) {
        query.department_code = { $regex: department_code, $options: "i" };
      }
    }
  }

  if (department_name) {
    query.department_name = { $regex: department_name, $options: "i" };
  }
  if (academic_semester) {
    query.academic_semester = parseInt(academic_semester, 10);
  }
  if (academic_year) {
    query.academic_year = parseInt(academic_year, 10);
  }

  // 計算總數
  const total = await CourseInfo.countDocuments(query);

  // 分頁查詢
  const skip = (page - 1) * page_size;
  const data = await CourseInfo.find(query).skip(skip).limit(page_size).lean(); // 使用 lean() 提升效能

  return { data, total };
}

export async function getAllDepartments() {
  await connectMongoDB();

  // 獲取所有不重複的系所
  const departments = await CourseInfo.aggregate([
    {
      $group: {
        _id: {
          department_code: "$department_code",
          department_name: "$department_name",
        },
      },
    },
    {
      $project: {
        _id: 0,
        department_code: "$_id.department_code",
        department_name: "$_id.department_name",
      },
    },
    {
      $sort: { department_code: 1 },
    },
  ]);

  return departments;
}
