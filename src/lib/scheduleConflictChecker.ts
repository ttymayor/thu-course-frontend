import { CourseInfoData } from "@/components/course-info/types";
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
    existingCourse: CourseInfoData;
    newCourse: CourseInfoData;
    conflictingSlots: {
      day: string;
      periods: number[];
    }[];
  }[];
}

/**
 * 檢查新課程是否與現有課程有時間衝突
 * @param existingCourses 已選擇的課程列表
 * @param newCourse 要新增的課程
 * @returns 衝突檢測結果
 */
export function checkScheduleConflict(
  existingCourses: CourseInfoData[],
  newCourse: CourseInfoData
): ConflictInfo {
  const conflictInfo: ConflictInfo = {
    hasConflict: false,
    conflictingCourses: [],
  };

  // 如果新課程沒有上課時間，則不會有衝突
  if (!newCourse.class_time) {
    return conflictInfo;
  }

  // 解析新課程的時間
  const newCourseTimeSlots = courseTimeParser(newCourse.class_time);

  // 檢查每個已存在的課程
  for (const existingCourse of existingCourses) {
    // 跳過相同的課程
    if (existingCourse.course_code === newCourse.course_code) {
      continue;
    }

    // 如果現有課程沒有上課時間，跳過
    if (!existingCourse.class_time) {
      continue;
    }

    // 解析現有課程的時間
    const existingTimeSlots = courseTimeParser(existingCourse.class_time);

    // 檢查時間衝突
    const conflictingSlots = findTimeConflicts(existingTimeSlots, newCourseTimeSlots);

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

/**
 * 找出兩個課程時間表之間的衝突
 * @param timeSlots1 第一個課程的時間表
 * @param timeSlots2 第二個課程的時間表
 * @returns 衝突的時間段
 */
function findTimeConflicts(
  timeSlots1: Array<{ day: string; periods: number[] }>,
  timeSlots2: Array<{ day: string; periods: number[] }>
): Array<{ day: string; periods: number[] }> {
  const conflicts: Array<{ day: string; periods: number[] }> = [];

  for (const slot1 of timeSlots1) {
    for (const slot2 of timeSlots2) {
      // 檢查是否為同一天
      if (slot1.day === slot2.day) {
        // 找出重疊的節次
        const overlappingPeriods = slot1.periods.filter(period =>
          slot2.periods.includes(period)
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

/**
 * 格式化衝突資訊為可讀的文字
 * @param conflictInfo 衝突資訊
 * @returns 格式化的衝突描述
 */
export function formatConflictMessage(conflictInfo: ConflictInfo): string {
  if (!conflictInfo.hasConflict) {
    return "";
  }

  const messages = conflictInfo.conflictingCourses.map(conflict => {
    const slotsText = conflict.conflictingSlots
      .map(slot => `${slot.day}第${slot.periods.join('、')}節`)
      .join('，');
    
    return `與「${conflict.existingCourse.course_name}」(${conflict.existingCourse.course_code}) 在 ${slotsText} 時間衝突`;
  });

  return messages.join('；');
}
