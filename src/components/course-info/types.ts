// 基本資訊介面
export interface BasicInfo {
  class_time: string;
  enrollment_notes: string;
  target_class: string;
  target_grade: string;
}

// 評分項目介面
export interface GradingItem {
  description: string;
  method: string;
  percentage: number;
}

// 選課紀錄介面
export interface SelectionRecord {
  date: string;
  enrolled: number;
  registered: number;
  remaining: number;
}

export interface CourseData {
  _id: string;
  is_closed: boolean;
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
  basic_info?: BasicInfo;
  course_description?: string;
  grading_items?: GradingItem[];
  selection_records?: SelectionRecord[];
  teaching_goal?: string;
  enrollment_notes?: string;
}

export interface Department {
  department_code: string;
  department_name: string;
}

export type CourseTypeMap = Record<number, string>;

export interface CourseFilters {
  search?: string;
  department?: string;
  page?: string;
}
