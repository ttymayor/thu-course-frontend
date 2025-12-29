import { Course } from "@/models/Course";
import connectMongoDB from "@/lib/mongodb";

interface CourseQuery {
  course_code?: string;
  course_name?: string | { $regex: string; $options: string };
  department_code?: string;
  department_name?: string | { $regex: string; $options: string };
  page?: number;
  page_size?: number;
}

interface CourseFilter {
  course_code?: string;
  course_name?: string;
  department_code?: string;
  department_name?: string;
  page?: number;
  page_size?: number;
}

async function buildQueryParams(params: CourseFilter) {
  const { course_code, course_name, department_code, department_name } = params;

  const query: CourseQuery = {};

  if (course_code) {
    query.course_code = course_code;
  }
  if (course_name) {
    query.course_name = {
      $regex: course_name,
      $options: "i",
    };
  }
  if (department_code) {
    query.department_code = department_code;
  }
  if (department_name) {
    query.department_name = {
      $regex: department_name,
      $options: "i",
    };
  }

  return query;
}

export async function getCourses(filter: CourseFilter = {}) {
  await connectMongoDB();
  const query = await buildQueryParams(filter);

  const page = typeof filter.page === "number" ? filter.page : 1;
  const page_size =
    typeof filter.page_size === "number" ? filter.page_size : 10;
  const skip = (page - 1) * page_size;

  const total = await Course.countDocuments(query);
  const data = await Course.find(query).skip(skip).limit(page_size).lean();
  return { data, total };
}

export async function getCourseByCode(course_code: string) {
  await connectMongoDB();
  const course = await Course.findOne({ course_code }).lean();
  return course;
}
