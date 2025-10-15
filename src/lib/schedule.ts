import { CourseData } from "@/components/course-info/types";

export const periodTimeMap = {
  A: { period: "A", startTime: "7:10", endTime: "8:00" },
  "1": { period: "1", startTime: "8:10", endTime: "9:00" },
  "2": { period: "2", startTime: "9:10", endTime: "10:00" },
  "3": { period: "3", startTime: "10:20", endTime: "11:10" },
  "4": { period: "4", startTime: "11:20", endTime: "12:10" },
  B: { period: "B", startTime: "12:10", endTime: "13:00" },
  "5": { period: "5", startTime: "13:10", endTime: "14:00" },
  "6": { period: "6", startTime: "14:10", endTime: "15:00" },
  "7": { period: "7", startTime: "15:20", endTime: "16:10" },
  "8": { period: "8", startTime: "16:20", endTime: "17:10" },
  "9": { period: "9", startTime: "17:20", endTime: "18:10" },
  "10": { period: "10", startTime: "18:20", endTime: "19:10" },
  "11": { period: "11", startTime: "19:20", endTime: "20:10" },
  "12": { period: "12", startTime: "20:20", endTime: "21:10" },
  "13": { period: "13", startTime: "21:20", endTime: "22:10" },
};

export const allPeriods = [
  "A",
  "1",
  "2",
  "3",
  "4",
  "B",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
];

export const allDays = ["一", "二", "三", "四", "五", "六", "日"];

export const days = allDays.slice(0, 5); // 預設只顯示平日
export const periods = allPeriods; // 預設顯示所有時段

export type ScheduleGrid = {
  [day: string]: {
    [period: string]: CourseData[];
  };
};
