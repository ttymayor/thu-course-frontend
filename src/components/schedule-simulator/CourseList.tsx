"use client";

import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { CourseTypeMap } from "@/components/course-info/types";
import { checkScheduleConflict } from "@/lib/scheduleConflictChecker";
import { courseTimeParser } from "@/lib/courseTimeParser";
import { Course } from "@/types/course";

interface CourseListProps {
  courses: Course[];
  selectedCourseCodes: Set<string>;
  selectedCourses: Course[];
  onSelectionChange: (course: Course, isSelected: boolean) => void;
  onCourseHover?: (course: Course | null) => void;
}

export default function CourseList({
  courses,
  selectedCourseCodes,
  selectedCourses,
  onSelectionChange,
  onCourseHover,
}: CourseListProps) {
  const courseTypeMap: CourseTypeMap = {
    1: "必修",
    2: "必選",
    3: "選修",
  };

  return (
    <TooltipProvider>
      <div className="mt-4 overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow className="h-12">
              <TableHead className="w-16 text-center">選擇</TableHead>
              <TableHead className="text-center">課程資訊</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course: Course) => {
              // 檢查是否已選擇
              const isSelected = selectedCourseCodes.has(course.course_code);

              // 檢查是否有時間衝突
              const conflictInfo = !isSelected
                ? checkScheduleConflict(selectedCourses, course)
                : null;
              const hasConflict = conflictInfo?.hasConflict || false;

              return (
                <TableRow
                  key={course.course_code}
                  className={`h-12 ${
                    course.is_closed
                      ? "opacity-30"
                      : hasConflict
                        ? "bg-destructive/20 opacity-30"
                        : ""
                  }`}
                  onMouseEnter={() => !hasConflict && onCourseHover?.(course)}
                  onMouseLeave={() => !hasConflict && onCourseHover?.(null)}
                >
                  <TableCell className="text-center">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) => {
                        onSelectionChange(course, !!checked);
                      }}
                      disabled={course.is_closed || hasConflict}
                      className={
                        hasConflict || course.is_closed
                          ? "cursor-not-allowed opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div>
                        <code className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                          {course.course_code}
                        </code>
                      </div>
                      <div className="flex flex-col">
                        <div>
                          {course.is_closed ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="line-through">
                                  {course.course_name}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <span>已停開...</span>
                              </TooltipContent>
                            </Tooltip>
                          ) : (
                            <Link
                              prefetch={false}
                              href={`/course-info/${course.course_code}`}
                              className="underline"
                            >
                              {course.course_name}
                            </Link>
                          )}
                          <Badge variant={"secondary"} className="ml-2 text-xs">
                            {courseTypeMap[course.course_type] ||
                              course.course_type}{" "}
                            {course.credits_1}-{course.credits_2}
                          </Badge>
                          {!course.basic_info.class_time ? (
                            <Badge variant={"outline"} className="ml-2 text-xs">
                              無時段
                            </Badge>
                          ) : null}
                          {hasConflict && (
                            <Badge
                              variant={"destructive"}
                              className="ml-2 text-xs"
                            >
                              時間衝突
                            </Badge>
                          )}
                        </div>
                        <div className="text-muted-foreground text-sm">
                          {course.teachers?.length
                            ? `${course.teachers.join("、")}`
                            : "-"}
                          {course.basic_info.class_time && (
                            <span>
                              {"｜"}
                              {courseTimeParser(
                                course.basic_info.class_time,
                              ).map((entry, index) => (
                                <span key={index}>
                                  {entry.day} {entry.periods.join(", ")}
                                  {entry.location && `［${entry.location}］`}
                                </span>
                              ))}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  );
}
