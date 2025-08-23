"use client";

import { X } from "lucide-react";
import { CourseInfoData } from "@/components/course-info/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { courseTimeParser } from "@/lib/courseTimeParser";
import React from "react";

interface ScheduleTableProps {
  selectedCourses: CourseInfoData[];
  hoveredCourse?: CourseInfoData | null;
  onRemoveCourse: (courseCode: string) => void;
}

type ScheduleGrid = {
  [day: string]: {
    [period: string]: CourseInfoData[];
  };
};

export default function ScheduleTable({
  selectedCourses,
  hoveredCourse,
  onRemoveCourse,
}: ScheduleTableProps) {
  const days = ["週一", "週二", "週三", "週四", "週五", "週六", "週日"];
  const periods = [
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

  const grid: ScheduleGrid = days.reduce((acc, day) => {
    acc[day] = periods.reduce((periodAcc, period) => {
      periodAcc[period] = [];
      return periodAcc;
    }, {} as { [period: string]: CourseInfoData[] });
    return acc;
  }, {} as ScheduleGrid);

  // 合併 selectedCourses 與 hoveredCourse（不重複）
  const allCourses =
    hoveredCourse &&
    !selectedCourses.some((c) => c.course_code === hoveredCourse.course_code)
      ? [...selectedCourses, hoveredCourse]
      : selectedCourses;

  allCourses.forEach((course) => {
    const parsedTimes = courseTimeParser(course.class_time);
    parsedTimes.forEach((time) => {
      const dayKey = time.day.replace("星期", "週");
      if (days.includes(dayKey)) {
        time.periods.forEach((p) => {
          const periodKey = String(p);
          if (grid[dayKey] && grid[dayKey][periodKey]) {
            grid[dayKey][periodKey].push(course);
          }
        });
      }
    });
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>排課模擬器</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto rounded-lg border">
          <div className="grid grid-cols-[auto_repeat(7,1fr)] min-w-[56rem]">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700"></div>
            {days.map((day) => (
              <div
                key={day}
                className="sticky top-0 z-10 px-4 py-3 text-center font-medium uppercase bg-gray-50 dark:bg-gray-700 border-l"
              >
                {day}
              </div>
            ))}

            {/* Grid Content */}
            {periods.map((period, periodIndex) => (
              <React.Fragment key={period}>
                {/* Time Slot Label */}
                <div
                  className={`px-4 py-4 font-medium content-center text-gray-700 dark:text-white dark:bg-gray-700 text-center border-t ${
                    periodIndex === 0 ? "" : ""
                  }`}
                >
                  {period}
                </div>
                {/* Cells */}
                {days.map((day) => (
                  <div
                    key={`${day}-${period}`}
                    className="relative px-2 py-2 h-24 border-t border-l"
                  >
                    {grid[day]?.[period]?.map((course) => (
                      <div
                        key={course.course_code}
                        className="relative bg-blue-100 dark:bg-blue-900 p-1 rounded-md mb-1 text-xs h-full flex flex-col justify-center"
                      >
                        <p className="font-semibold text-center">
                          {course.course_name}
                        </p>
                        <p className="text-center">
                          {course.teachers.join(", ")}
                        </p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-0 right-0 h-4 w-4 mt-1 mr-1"
                          onClick={() => onRemoveCourse(course.course_code)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
