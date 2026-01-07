import { GradingItem, SelectionRecord } from "@/types/course";

export type { GradingItem, SelectionRecord };

export type CourseTypeMap = Record<number, string>;

export interface CourseFilters {
  search?: string;
  department?: string;
  page?: string;
}
