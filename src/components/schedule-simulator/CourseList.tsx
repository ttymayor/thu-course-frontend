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
import { CourseInfoData, CourseTypeMap } from "@/components/course-info/types";
import { checkScheduleConflict } from "@/lib/scheduleConflictChecker";
import { courseTimeParser } from "@/lib/courseTimeParser";

interface CourseListProps {
  infos: CourseInfoData[];
  selectedCourseCodes: Set<string>;
  selectedCourses: CourseInfoData[];
  onSelectionChange: (course: CourseInfoData, isSelected: boolean) => void;
  onCourseHover?: (course: CourseInfoData | null) => void;
}

export default function CourseList({
  infos,
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
      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow className="h-12">
              <TableHead className="text-center w-16">選擇</TableHead>
              <TableHead className="text-center">課程資訊</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {infos.map((item: CourseInfoData) => {
              // 檢查是否已選擇
              const isSelected = selectedCourseCodes.has(item.course_code);

              // 檢查是否有時間衝突
              const conflictInfo = !isSelected
                ? checkScheduleConflict(selectedCourses, item)
                : null;
              const hasConflict = conflictInfo?.hasConflict || false;

              return (
                <TableRow
                  key={item.course_code}
                  className={`h-12 ${
                    item.is_closed
                      ? "opacity-30"
                      : hasConflict
                      ? "bg-red-50 dark:bg-red-950/20"
                      : ""
                  }`}
                  onMouseEnter={() => onCourseHover?.(item)}
                  onMouseLeave={() => onCourseHover?.(null)}
                >
                  <TableCell className="text-center">
                    {hasConflict ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="inline-block">
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={(checked) => {
                                onSelectionChange(item, !!checked);
                              }}
                              disabled={item.is_closed || hasConflict}
                              className="cursor-not-allowed opacity-50"
                            />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="max-w-xs">
                            <p className="font-medium text-red-600">時間衝突</p>
                            <p className="text-sm">
                              此課程與已選課程有時間衝突，無法新增
                            </p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) => {
                          onSelectionChange(item, !!checked);
                        }}
                        disabled={item.is_closed}
                        className="cursor-pointer"
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div>
                        <code className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                          {item.course_code}
                        </code>
                      </div>
                      <div className="flex flex-col">
                        <div>
                          {item.is_closed ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="line-through">
                                  {item.course_name}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <span>已停開...</span>
                              </TooltipContent>
                            </Tooltip>
                          ) : (
                            <Link
                              prefetch={false}
                              href={`/course-detail/${item.course_code}`}
                              className="underline"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {item.course_name}
                            </Link>
                          )}
                          <Badge variant={"secondary"} className="ml-2 text-xs">
                            {courseTypeMap[item.course_type] ||
                              item.course_type}{" "}
                            {item.credits_1}-{item.credits_2}
                          </Badge>
                          {!item.class_time ? (
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
                        <div className="text-sm text-muted-foreground">
                          {item.teachers?.length
                            ? `${item.teachers.join("、")}`
                            : "-"}
                          {item.class_time && (
                            <span>
                              {"｜"}
                              {courseTimeParser(item.class_time).map(
                                (entry, index) => (
                                  <span key={index}>
                                    {entry.day} {entry.periods.join(", ")}
                                    {entry.location && `［${entry.location}］`}
                                  </span>
                                )
                              )}
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
