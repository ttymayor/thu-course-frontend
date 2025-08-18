import mongoose, { Document } from "mongoose";
import connectMongoDB from "@/lib/mongodb";

// 課程詳細資訊的型別定義
export interface BasicInfo {
  class_time: string;
  enrollment_notes: string;
  target_class: string;
  target_grade: string;
}

export interface GradingItem {
  description: string;
  method: string;
  percentage: number;
}

export interface SelectionRecord {
  date: string;
  enrolled: number;
  registered: number;
  remaining: number;
}

export interface CourseDetail {
  _id?: string;
  basic_info: BasicInfo;
  course_code: string;
  course_name?: string; // 從 course_info 表中獲取
  course_description: string;
  grading_items: GradingItem[];
  selection_records: SelectionRecord[];
  teachers: string[];
  teaching_goal: string;
}

// MongoDB 文件介面
interface CourseDetailDocument extends Document {
  basic_info: BasicInfo;
  course_code: string;
  course_description: string;
  grading_items: GradingItem[];
  selection_records: SelectionRecord[];
  teachers: string[];
  teaching_goal: string;
}

// 定義 Mongoose Schema
const BasicInfoSchema = new mongoose.Schema(
  {
    class_time: String,
    enrollment_notes: String,
    target_class: String,
    target_grade: String,
  },
  { _id: false }
);

const GradingItemSchema = new mongoose.Schema(
  {
    description: String,
    method: String,
    percentage: Number,
  },
  { _id: false }
);

const SelectionRecordSchema = new mongoose.Schema(
  {
    date: String,
    enrolled: Number,
    registered: Number,
    remaining: Number,
  },
  { _id: false }
);

const CourseDetailSchema = new mongoose.Schema({
  basic_info: BasicInfoSchema,
  course_code: { type: String, required: true, unique: true },
  course_description: String,
  grading_items: [GradingItemSchema],
  selection_records: [SelectionRecordSchema],
  teachers: [String],
  teaching_goal: String,
});

// 建立或取得模型
const CourseDetailModel =
  mongoose.models.CourseDetail ||
  mongoose.model<CourseDetailDocument>(
    "CourseDetail",
    CourseDetailSchema,
    "course_detail"
  );

// 根據課程代碼獲取課程詳細資訊
export async function getCourseDetail(
  courseCode: string
): Promise<CourseDetail | null> {
  try {
    await connectMongoDB();

    // 獲取課程詳細資訊
    const courseDetail = await CourseDetailModel.findOne({
      course_code: courseCode,
    }).lean();

    if (!courseDetail) {
      return null;
    }

    // 獲取課程基本資訊（課程名稱）
    const courseInfoCollection =
      mongoose.connection.db?.collection("course_info");
    let courseName = "";

    if (courseInfoCollection) {
      const courseInfo = await courseInfoCollection.findOne({
        course_code: courseCode,
      });
      courseName = courseInfo?.course_name || "";
    }

    const doc = courseDetail as unknown as CourseDetail & {
      _id: mongoose.Types.ObjectId;
    };

    return {
      _id: doc._id?.toString(),
      basic_info: doc.basic_info,
      course_code: doc.course_code,
      course_name: courseName,
      course_description: doc.course_description,
      grading_items: doc.grading_items,
      selection_records: doc.selection_records,
      teachers: doc.teachers,
      teaching_goal: doc.teaching_goal,
    };
  } catch (error) {
    console.error("Error fetching course detail:", error);
    return null;
  }
}

// 獲取所有課程代碼（用於靜態路徑生成，如果需要的話）
export async function getAllCourseCodes(): Promise<string[]> {
  try {
    await connectMongoDB();

    const courseCodes = await CourseDetailModel.distinct("course_code");
    return courseCodes;
  } catch (error) {
    console.error("Error fetching course codes:", error);
    return [];
  }
}
