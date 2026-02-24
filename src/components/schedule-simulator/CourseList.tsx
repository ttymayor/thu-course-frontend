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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, Clock, MapPin, User } from "lucide-react";
import { cn } from "@/lib/utils";

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
      <div className="mt-4">
        <Tabs defaultValue="card" className="w-full">
          <TabsList className="w-full gap-1">
            <TabsTrigger value="list" className="cursor-pointer">
              列表
            </TabsTrigger>
            <TabsTrigger value="card" className="cursor-pointer">
              卡片
            </TabsTrigger>
          </TabsList>
          <TabsContent value="list">
            <div className="overflow-x-auto">
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
                    const isSelected = selectedCourseCodes.has(
                      course.course_code,
                    );

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
                              ? "bg-destructive/10"
                              : ""
                        }`}
                        onMouseEnter={() =>
                          !hasConflict && onCourseHover?.(course)
                        }
                        onMouseLeave={() =>
                          !hasConflict && onCourseHover?.(null)
                        }
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
                                ? "cursor-not-allowed"
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
                                <Badge
                                  variant={"secondary"}
                                  className="ml-2 text-xs"
                                >
                                  {courseTypeMap[course.course_type] ||
                                    course.course_type}{" "}
                                  {course.credits_1}-{course.credits_2}
                                </Badge>
                                {!course.basic_info.class_time ? (
                                  <Badge
                                    variant={"outline"}
                                    className="ml-2 text-xs"
                                  >
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
                                        {entry.location &&
                                          `［${entry.location}］`}
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
          </TabsContent>
          <TabsContent value="card">
            <ScrollArea className="h-150">
              <div className="grid grid-cols-1 gap-2">
                {courses.map((course: Course) => {
                  // 檢查是否已選擇
                  const isSelected = selectedCourseCodes.has(
                    course.course_code,
                  );

                  // 檢查是否有時間衝突
                  const conflictInfo = !isSelected
                    ? checkScheduleConflict(selectedCourses, course)
                    : null;
                  const hasConflict = conflictInfo?.hasConflict || false;

                  return (
                    <Card
                      className={cn(
                        "relative flex gap-4 rounded-xl transition-all duration-300 ease-out",
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
                      onMouseEnter={() =>
                        !hasConflict && onCourseHover?.(course)
                      }
                      onMouseLeave={() => !hasConflict && onCourseHover?.(null)}
                    >
                      <CardHeader>
                        <div className="mb-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className="text-muted-foreground border-secondary font-mono text-xs"
                            >
                              {course.course_code}
                            </Badge>
                            <Badge
                              variant="secondary"
                              className="h-5 px-1.5 text-[10px]"
                            >
                              {courseTypeMap[course.course_type] ||
                                course.course_type}
                              <span className="ml-1 opacity-70">
                                {course.credits_1}-{course.credits_2}
                              </span>
                            </Badge>
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
                                <AlertCircle className="h-3 w-3" /> 衝突
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

                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) =>
                              onSelectionChange(course, !!checked)
                            }
                            disabled={course.is_closed || hasConflict}
                            className={`size-5 ${hasConflict || course.is_closed ? "cursor-not-allowed" : "data-[state=checked]:bg-primary cursor-pointer"}`}
                          />

                          <div className="flex-1">
                            {course.is_closed ? (
                              <span className="text-muted-foreground text-base font-bold line-through">
                                {course.course_name}
                              </span>
                            ) : (
                              <Link
                                prefetch={false}
                                href={`/course-info/${course.course_code}`}
                                className="hover:text-primary decoration-primary/50 text-base leading-tight font-bold underline-offset-4 transition-colors hover:underline"
                              >
                                {course.course_name}
                              </Link>
                            )}
                          </div>
                        </div>
                      </CardHeader>

                      <div className="border-border mx-4 border-t"></div>

                      <CardContent>
                        <div className="text-muted-foreground flex flex-col gap-2 text-sm">
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
                              <div className="flex flex-col">
                                {courseTimeParser(
                                  course.basic_info.class_time,
                                ).map((entry, index) => (
                                  <div
                                    key={index}
                                    className="flex flex-wrap items-center gap-x-2"
                                  >
                                    <span>
                                      {entry.day} {entry.periods.join(", ")}
                                    </span>
                                    {entry.location && (
                                      <span className="text-muted-foreground/70 bg-secondary/50 flex items-center rounded px-1.5 text-xs">
                                        <MapPin className="mr-1 inline size-3" />
                                        {entry.location}
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  );
}
