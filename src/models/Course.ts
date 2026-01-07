import mongoose, { Schema, Document, Model } from "mongoose";

export interface CourseDocument extends Document {
  academic_year: number;
  academic_semester: number;
  course_code: string;
  course_name: string;
  department_code: string;
  department_name: string;
  is_closed: boolean;
  basic_info: {
    class_time: string;
    target_class: string;
    target_grade: string;
    enrollment_notes: string;
  };
  course_description: string;
  course_type: number;
  credits_1: number;
  credits_2: number;
  grading_items: Array<{
    method: string;
    percentage: number;
    description: string;
  }>;
  selection_records: Array<{
    date: string;
    enrolled: number;
    remaining: number;
    registered: number;
  }>;
  teachers: Array<string>;
  teaching_goal: string;
}

const courseSchema = new Schema<CourseDocument>({
  course_code: {
    type: String,
    required: true,
    unique: true,
  },
  course_name: {
    type: String,
    required: true,
  },
  course_description: {
    type: String,
    required: true,
  },
  department_code: {
    type: String,
    required: true,
  },
  department_name: {
    type: String,
    required: true,
  },
  is_closed: {
    type: Boolean,
    required: true,
  },
  basic_info: {
    class_time: {
      type: String,
      required: true,
    },
    target_class: {
      type: String,
      required: true,
    },
    target_grade: {
      type: String,
      required: true,
    },
    enrollment_notes: {
      type: String,
      required: true,
    },
  },
  course_type: {
    type: Number,
    required: true,
  },
  credits_1: {
    type: Number,
    required: true,
  },
  credits_2: {
    type: Number,
    required: true,
  },
  grading_items: [
    {
      method: {
        type: String,
        required: true,
      },
      percentage: {
        type: Number,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
    },
  ],
  selection_records: [
    {
      date: {
        type: String,
        required: true,
      },
      enrolled: {
        type: Number,
        required: true,
      },
      remaining: {
        type: Number,
        required: true,
      },
      registered: {
        type: Number,
        required: true,
      },
    },
  ],
  teachers: [
    {
      type: String,
      required: true,
    },
  ],
  teaching_goal: {
    type: String,
    required: true,
  },
});

export const Course: Model<CourseDocument> =
  mongoose.models.Course ||
  mongoose.model<CourseDocument>("Course", courseSchema, "courses");
