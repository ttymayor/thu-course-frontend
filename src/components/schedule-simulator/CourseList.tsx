"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { CourseTypeMap } from "@/components/course-info/types";
import { checkScheduleConflict } from "@/lib/scheduleConflictChecker";
import { courseTimeParser } from "@/lib/courseTimeParser";
import { Course } from "@/types/course";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, Clock, MapPin, Star, User } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

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
      <ScrollArea className="h-150">
        <div className="grid grid-cols-1 gap-2 p-px">
          {courses.map((course: Course) => {
            // 檢查是否已選擇
            const isSelected = selectedCourseCodes.has(course.course_code);

            // 檢查是否有時間衝突
            const conflictInfo = !isSelected
              ? checkScheduleConflict(selectedCourses, course)
              : null;
            const hasConflict = conflictInfo?.hasConflict || false;

            return (
              <Card
                className={cn(
                  "relative flex border-foreground/10 transition-all rounded-md ease-out py-4 gap-3",
                  !isSelected &&
                    !hasConflict &&
                    !course.is_closed &&
                    "hover:border-primary/40 hover:bg-accent/40",
                  isSelected &&
                    "border-primary/60 bg-primary/5 ring-primary/30 ring-1",
                  hasConflict &&
                    "border-destructive/60 bg-destructive/10 ring-destructive/30 ring-1",
                  course.is_closed &&
                    "pointer-events-none opacity-50 grayscale",
                )}
                key={course.course_code}
                onMouseEnter={() => !hasConflict && onCourseHover?.(course)}
                onMouseLeave={() => !hasConflict && onCourseHover?.(null)}
              >
                <CardHeader className="px-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) =>
                        onSelectionChange(course, !!checked)
                      }
                      disabled={course.is_closed || hasConflict}
                      className={`border-foreground/10 size-5 ${hasConflict || course.is_closed ? "cursor-not-allowed" : "data-[state=checked]:bg-primary cursor-pointer"}`}
                    />

                    <div className="flex flex-1 items-center gap-1">
                      <Badge
                        variant="outline"
                        className="border-foreground/10 self-start px-1.5 font-mono text-[10px]"
                      >
                        {course.course_code}
                      </Badge>
                      {course.is_closed ? (
                        <span className="text-muted-foreground text-base font-bold line-through">
                          {course.course_name}
                        </span>
                      ) : (
                        <Link
                          href={`/course-info/${course.course_code}`}
                          prefetch={false}
                          className="hover:text-primary decoration-primary/50 line-clamp-2 cursor-pointer text-left text-base leading-tight font-bold underline-offset-4 transition-colors hover:underline"
                        >
                          {course.course_name}
                        </Link>
                      )}
                    </div>

                    <div className="flex gap-1">
                      {!course.basic_info.class_time && (
                        <Badge
                          variant="outline"
                          className="h-5 px-1 text-[10px]"
                        >
                          無時段
                        </Badge>
                      )}
                      {hasConflict && (
                        <Badge
                          variant="destructive"
                          className="h-5 gap-1 px-1 text-[10px]"
                        >
                          <AlertCircle className="size-3" /> 衝突
                        </Badge>
                      )}
                      {course.is_closed && (
                        <Badge
                          variant="destructive"
                          className="h-5 px-1 text-[10px]"
                        >
                          已停開
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="px-4">
                  <div className="text-muted-foreground flex flex-col gap-2 text-sm">
                    {/* 學分 */}
                    <div className="flex items-center gap-2.5">
                      <Star className="text-primary/70 size-4 shrink-0" />
                      <span className="truncate">
                        {courseTypeMap[course.course_type] ||
                          course.course_type}{" "}
                        {course.credits_1} - {course.credits_2}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <User className="text-primary/70 size-4 shrink-0" />
                      <span className="truncate">
                        {course.teachers?.length
                          ? course.teachers.join("、")
                          : "未定"}
                      </span>
                    </div>

                    {course.basic_info.class_time && (
                      <div className="flex items-start gap-2.5">
                        <Clock className="text-primary/70 mt-0.5 size-4 shrink-0" />
                        <div className="flex flex-col gap-y-1">
                          {courseTimeParser(course.basic_info.class_time).map(
                            (entry, index) => (
                              <div
                                key={index}
                                className="flex flex-wrap items-center gap-x-2"
                              >
                                <span>
                                  {entry.day} {entry.periods.join(", ")}
                                </span>
                                {entry.location && (
                                  <Badge
                                    variant="ghost"
                                    className="border-foreground/10 px-1.5 text-[10px] [&>svg]:size-2.5"
                                  >
                                    <MapPin />
                                    {entry.location}
                                  </Badge>
                                )}
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
          {courses.length === 0 && (
            <div className="text-muted-foreground py-4 text-center italic select-none">
              沒有符合條件的課程
            </div>
          )}
        </div>
      </ScrollArea>
    </TooltipProvider>
  );
}
