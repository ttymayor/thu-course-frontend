"use client";

import { X } from "lucide-react";
import { CourseInfoData } from "@/components/course-info/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  const days = ["一", "二", "三", "四", "五", "六", "日"];
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
      const dayKey = time.day.replace("星期", "");
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20 text-center font-medium">
                  時段
                </TableHead>
                {days.map((day) => (
                  <TableHead key={day} className="w-32 text-center font-medium">
                    {day}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {periods.map((period) => (
                <TableRow key={period}>
                  <TableCell className="w-20 text-center font-medium py-4">
                    {period}
                  </TableCell>
                  {days.map((day) => (
                    <TableCell
                      key={`${day}-${period}`}
                      className="w-32 p-2 h-24 align-top"
                    >
                      {grid[day]?.[period]?.map((course) => (
                        <div
                          key={course.course_code}
                          className="relative bg-indigo-100 dark:bg-indigo-900 p-2 rounded-md mb-1 text-xs h-full flex flex-col justify-center"
                        >
                          <code className="text-center">
                            {course.course_code}
                          </code>
                          <p className="font-semibold text-center">
                            {course.course_name}
                          </p>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-0 right-0 h-4 w-4 mt-1 mr-1 cursor-pointer"
                            onClick={() => onRemoveCourse(course.course_code)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
