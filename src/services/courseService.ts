import { Course as CourseModel, CourseDocument } from "@/models/Course";
import connectMongoDB from "@/lib/mongodb";
// import mongoose from "mongoose";
import { QueryFilter } from "mongoose";
import { Course } from "@/types/course";
import { CourseTerm, dedupeCourseTerms } from "@/lib/courseIdentity";

export interface CourseFilter {
  academic_year?: number;
  academic_semester?: number;
  course_code?: string;
  course_name?: string;
  teacher?: string;
  department_code?: string;
  department_name?: string;
  course_codes?: string[];
  page?: number;
  page_size?: number;
}

async function buildQueryParams(params: CourseFilter, term: CourseTerm | null) {
  const {
    course_code,
    course_name,
    teacher,
    department_code,
    department_name,
    course_codes,
  } = params;

  const query: QueryFilter<CourseDocument> = {} as QueryFilter<CourseDocument>;

  if (term) {
    query.academic_year = term.academic_year;
    query.academic_semester = term.academic_semester;
  }

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
        if (teacher && teacher === course_code) {
          query.$or.push({ teachers: { $regex: teacher, $options: "i" } });
        } else if (teacher) {
          query.teachers = { $regex: teacher, $options: "i" };
        }
      } else {
        if (course_code) {
          query.course_code = { $regex: course_code, $options: "i" };
        }
        if (course_name && course_name !== course_code) {
          query.course_name = { $regex: course_name, $options: "i" };
        }
        if (teacher) {
          query.teachers = { $regex: teacher, $options: "i" };
        }
      }
    } else {
      // 判斷是否為統一搜尋 (搜尋欄輸入字串同時傳入多個參數)
      const isUnifiedSearch =
        course_code &&
        course_code === course_name &&
        (!teacher || teacher === course_code);

      if (isUnifiedSearch) {
        query.$or = [
          { course_code: { $regex: course_code, $options: "i" } },
          { course_name: { $regex: course_code, $options: "i" } },
        ];
        if (teacher) {
          query.$or.push({ teachers: { $regex: teacher, $options: "i" } });
        }
        if (department_code && department_code === course_code) {
          query.$or.push({
            department_code: { $regex: department_code, $options: "i" },
          });
        }
      } else {
        // 分別處理各個欄位
        if (course_code && course_name && course_code === course_name) {
          query.$or = [
            { course_code: { $regex: course_code, $options: "i" } },
            { course_name: { $regex: course_code, $options: "i" } },
          ];
          if (teacher && teacher === course_code) {
            query.$or.push({ teachers: { $regex: teacher, $options: "i" } });
          } else if (teacher) {
            query.teachers = { $regex: teacher, $options: "i" };
          }
        } else {
          if (course_code) {
            query.course_code = { $regex: course_code, $options: "i" };
          }
          if (course_name && course_name !== course_code) {
            query.course_name = { $regex: course_name, $options: "i" };
          }
          if (teacher) {
            query.teachers = { $regex: teacher, $options: "i" };
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

export async function getCourseTerms(): Promise<CourseTerm[]> {
  await connectMongoDB();
  const terms = await CourseModel.aggregate<{
    _id: CourseTerm;
  }>([
    {
      $group: {
        _id: {
          academic_year: "$academic_year",
          academic_semester: "$academic_semester",
        },
      },
    },
    { $sort: { "_id.academic_year": -1, "_id.academic_semester": -1 } },
  ]);

  return dedupeCourseTerms(terms.map((term) => term._id)).sort(
    (a, b) =>
      b.academic_year - a.academic_year ||
      b.academic_semester - a.academic_semester,
  );
}

export async function getLatestCourseTerm(): Promise<CourseTerm | null> {
  const terms = await getCourseTerms();
  return terms[0] ?? null;
}

function getRequestedTerm(filter: CourseFilter): CourseTerm | null {
  if (
    typeof filter.academic_year === "number" &&
    typeof filter.academic_semester === "number"
  ) {
    return {
      academic_year: filter.academic_year,
      academic_semester: filter.academic_semester,
    };
  }

  return null;
}

export async function getCourses(
  filter: CourseFilter = {},
): Promise<{ data: Course[]; total: number; term: CourseTerm | null }> {
  await connectMongoDB();
  const term = getRequestedTerm(filter) ?? (await getLatestCourseTerm());
  const query = await buildQueryParams(filter, term);

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

  return { data, total, term };
}

export async function getCourseByCode(
  course_code: string,
  term?: CourseTerm | null,
): Promise<Course | null> {
  await connectMongoDB();
  const resolvedTerm = term ?? (await getLatestCourseTerm());
  const rawCourse = await CourseModel.findOne({
    ...(resolvedTerm ?? {}),
    course_code,
  }).lean();

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
