import mongoose from "mongoose";
import connectMongoDB from "./mongodb";

const courseInfoSchema = new mongoose.Schema({
  is_closed: Boolean,
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

  const query: CourseInfoQuery = {};

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

  const skip = (page - 1) * page_size;

  const aggregationPipeline = [
    { $match: query },
    {
      $lookup: {
        from: "course_detail",
        localField: "course_code",
        foreignField: "course_code",
        as: "detail",
      },
    },
    {
      $unwind: {
        path: "$detail",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $addFields: {
        is_closed: "$detail.is_closed",
        class_time: "$detail.basic_info.class_time",
        target_class: "$detail.basic_info.target_class",
        target_grade: "$detail.basic_info.target_grade",
        teachers: "$detail.teachers",
      },
    },
    {
      $project: {
        _id: 0,
        detail: 0,
      },
    },
    {
      $facet: {
        paginatedResults: [{ $skip: skip }, { $limit: page_size }],
        totalCount: [{ $count: "count" }],
      },
    },
  ];

  const results = await CourseInfo.aggregate(aggregationPipeline);

  const data = results[0].paginatedResults;
  const total =
    results[0].totalCount.length > 0 ? results[0].totalCount[0].count : 0;

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
