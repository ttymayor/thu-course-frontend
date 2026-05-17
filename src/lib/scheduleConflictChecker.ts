import { Course } from "@/types/course";
import { courseTimeParser } from "./courseTimeParser";

export interface TimeSlot {
  day: string;
  periods: number[];
  courseCode: string;
  courseName: string;
}

export interface ConflictInfo {
  hasConflict: boolean;
  conflictingCourses: {
    existingCourse: Course;
    newCourse: Course;
    conflictingSlots: {
      day: string;
      periods: number[];
    }[];
  }[];
}

export function checkScheduleConflict(
  existingCourses: Course[],
  newCourse: Course,
): ConflictInfo {
  const conflictInfo: ConflictInfo = {
    hasConflict: false,
    conflictingCourses: [],
  };

  // 如果新課程沒有上課時間，則不會有衝突
  if (!newCourse.basic_info.class_time) {
    return conflictInfo;
  }

  // 解析新課程的時間
  const newCourseTimeSlots = courseTimeParser(newCourse.basic_info.class_time);

  // 檢查每個已存在的課程
  for (const existingCourse of existingCourses) {
    // 跳過相同的課程
    if (existingCourse.course_code === newCourse.course_code) {
      continue;
    }

    // 如果現有課程沒有上課時間，跳過
    if (!existingCourse.basic_info.class_time) {
      continue;
    }

    // 解析現有課程的時間
    const existingTimeSlots = courseTimeParser(
      existingCourse.basic_info.class_time,
    );

    // 檢查時間衝突
    const conflictingSlots = findTimeConflicts(
      existingTimeSlots,
      newCourseTimeSlots,
    );

    if (conflictingSlots.length > 0) {
      conflictInfo.hasConflict = true;
      conflictInfo.conflictingCourses.push({
        existingCourse,
        newCourse,
        conflictingSlots,
      });
    }
  }

  return conflictInfo;
}

function findTimeConflicts(
  timeSlots1: Array<{ day: string; periods: number[] }>,
  timeSlots2: Array<{ day: string; periods: number[] }>,
): Array<{ day: string; periods: number[] }> {
  const conflicts: Array<{ day: string; periods: number[] }> = [];

  for (const slot1 of timeSlots1) {
    for (const slot2 of timeSlots2) {
      // 檢查是否為同一天
      if (slot1.day === slot2.day) {
        // 找出重疊的節次
        const overlappingPeriods = slot1.periods.filter((period) =>
          slot2.periods.includes(period),
        );

        if (overlappingPeriods.length > 0) {
          conflicts.push({
            day: slot1.day,
            periods: overlappingPeriods,
          });
        }
      }
    }
  }

  return conflicts;
}
