import mongoose, { Schema, Document, Model } from "mongoose";

export interface DepartmentDocument extends Document {
  department_code: string;
  department_name: string;
  category_code: string;
  category_name: string;
  department_url: string;
}

const departmentSchema = new Schema<DepartmentDocument>({
  department_code: {
    type: String,
    required: true,
  },
  department_name: {
    type: String,
    required: true,
  },
  category_code: {
    type: String,
    required: true,
  },
  category_name: {
    type: String,
    required: true,
  },
  department_url: {
    type: String,
    required: true,
  },
});

export const Department: Model<DepartmentDocument> =
  mongoose.models.Department ||
  mongoose.model<DepartmentDocument>(
    "Department",
    departmentSchema,
    "departments",
  );
