export interface CourseInfoData {
  _id: string;
  academic_semester: string;
  academic_year: string;
  course_code: string;
  course_name: string;
  course_type: number;
  credits_1: number;
  credits_2: number;
  department_code: string;
  department_name: string;
  class_time: string;
  target_class: string;
  target_grade: string;
  teachers: string[];
}

export interface Department {
  department_code: string;
  department_name: string;
}

export type CourseTypeMap = Record<number, string>;

export interface CourseInfoFilters {
  search?: string;
  department?: string;
  page?: string;
}
