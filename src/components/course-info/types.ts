import { Course, GradingItem, SelectionRecord } from "@/types/course";

export type CourseData = Course;
export type { GradingItem, SelectionRecord };

export type CourseTypeMap = Record<number, string>;

export interface CourseFilters {
  search?: string;
  department?: string;
  page?: string;
}
