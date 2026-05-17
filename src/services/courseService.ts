import { Course as CourseModel, CourseDocument } from "@/models/Course";
import connectMongoDB from "@/lib/mongodb";
// import mongoose from "mongoose";
import { QueryFilter } from "mongoose";
import { Course } from "@/types/course";

export interface CourseFilter {
  course_code?: string;
  course_name?: string;
  department_code?: string;
  department_name?: string;
  course_codes?: string[];
  page?: number;
  page_size?: number;
}

async function buildQueryParams(params: CourseFilter) {
  const {
    course_code,
    course_name,
    department_code,
    department_name,
    course_codes,
  } = params;

  const query: QueryFilter<CourseDocument> = {} as QueryFilter<CourseDocument>;

  if (course_codes && course_codes.length > 0) {
    query.course_code = { $in: course_codes };
  } else {
    // 判斷是否為針對系所的過濾
    const isDeptFilter =
      department_code &&
      department_code !== course_code &&
      department_code !== course_name;

    if (isDeptFilter) {
      query.department_code = { $regex: department_code, $options: "i" };
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
      // 判斷是否為統一搜尋 (搜尋欄輸入字串同時傳入三個參數)
      const isUnifiedSearch =
        course_code === course_name &&
        course_name === department_code &&
        course_code;

      if (isUnifiedSearch) {
        query.$or = [
          { course_code: { $regex: course_code, $options: "i" } },
          { course_name: { $regex: course_code, $options: "i" } },
          { department_code: { $regex: course_code, $options: "i" } },
        ];
      } else {
        // 分別處理各個欄位
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
        if (
          department_code &&
          department_code !== course_code &&
          department_code !== course_name
        ) {
          query.department_code = { $regex: department_code, $options: "i" };
        }
      }
    }
  }

  if (department_name) {
    query.department_name = { $regex: department_name, $options: "i" };
  }

  return query;
}

export async function getCourses(
  filter: CourseFilter = {},
): Promise<{ data: Course[]; total: number }> {
  await connectMongoDB();
  const query = await buildQueryParams(filter);

  const page = typeof filter.page === "number" ? filter.page : 1;
  const page_size =
    typeof filter.page_size === "number" ? filter.page_size : 10;
  const skip = (page - 1) * page_size;

  const total = await CourseModel.countDocuments(query);
  const rawData = await CourseModel.find(query)
    .skip(skip)
    .limit(page_size)
    .lean();

  const data = rawData.map((course) => ({
    ...course,
    _id: course._id.toString(),
    teachers:
      course.teachers && Array.isArray(course.teachers)
        ? course.teachers.filter(
            (teacher) => teacher && teacher.trim().length > 0,
          )
        : [],
  }));

  return { data, total };
}

export async function getCourseByCode(
  course_code: string,
): Promise<Course | null> {
  await connectMongoDB();
  const rawCourse = await CourseModel.findOne({ course_code }).lean();

  if (rawCourse) {
    return {
      ...rawCourse,
      _id: rawCourse._id.toString(),
      teachers:
        rawCourse.teachers && Array.isArray(rawCourse.teachers)
          ? rawCourse.teachers.filter(
              (teacher) => teacher && teacher.trim().length > 0,
            )
          : [],
    };
  }

  return null;
}
