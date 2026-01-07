export interface GradingItem {
  method: string;
  percentage: number;
  description: string;
}

export interface SelectionRecord {
  date: string;
  enrolled: number;
  remaining: number;
  registered: number;
}

export interface BasicInfo {
  class_time: string;
  target_class: string;
  target_grade: string;
  enrollment_notes: string;
}

export interface Course {
  _id?: string;
  academic_year: number;
  academic_semester: number;
  course_code: string;
  course_name: string;
  department_code: string;
  department_name: string;
  is_closed: boolean;
  basic_info: BasicInfo;
  course_description: string;
  course_type: number;
  credits_1: number;
  credits_2: number;
  grading_items: Array<GradingItem>;
  selection_records: Array<SelectionRecord>;
  teachers: Array<string>;
  teaching_goal: string;
}
