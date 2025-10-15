import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { periodTimeMap, ScheduleGrid } from "@/lib/schedule";
import { courseLocation } from "@/lib/courseTimeParser";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { CourseData } from "@/components/course-info/types";

interface ScheduleTableProps {
  tableRef?: React.RefObject<HTMLTableElement | null>;
  days: string[];
  periods: string[];
  grid: ScheduleGrid;
  hoveredCourse: CourseData | null;
  isViewingShared: boolean;
  onRemoveCourse?: (courseCode: string) => void;
  onCourseHover?: (hoveredCourse: CourseData | null) => void;
}

export default function ScheduleTable({
  tableRef,
  days,
  periods,
  grid,
  hoveredCourse,
  isViewingShared,
  onRemoveCourse,
}: ScheduleTableProps) {
  return (
    <Table className="table-fixed w-full bg-card" ref={tableRef}>
      <TableHeader>
        <TableRow>
          <TableHead className="w-8 sm:w-16 text-center font-medium text-xs sm:text-sm px-1 sm:px-2">
            時段
          </TableHead>
          {days.map((day) => (
            <TableHead
              key={day}
              className="text-center font-medium text-xs sm:text-sm px-1 sm:px-2"
            >
              {day}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {periods.map((period) => (
          <TableRow key={period}>
            <TableCell className="text-center font-medium py-2 sm:py-3 px-1 sm:px-2">
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-semibold">
                  {periodTimeMap[period as keyof typeof periodTimeMap].period}
                </span>
                <span className="text-[10px] sm:text-xs text-muted-foreground">
                  {
                    periodTimeMap[period as keyof typeof periodTimeMap]
                      .startTime
                  }
                </span>
                <span className="text-[10px] sm:text-xs text-muted-foreground">
                  {periodTimeMap[period as keyof typeof periodTimeMap].endTime}
                </span>
              </div>
            </TableCell>
            {days.map((day) => (
              <TableCell
                key={`${day}-${period}`}
                className="p-1 sm:p-2 h-16 sm:h-20 align-top"
              >
                <div className="h-full flex flex-col">
                  {grid[day]?.[period]?.map((course: CourseData) => (
                    <div
                      key={course.course_code}
                      className={cn(
                        isViewingShared
                          ? "border-dashed border-1 bg-schedule-course-bg/50"
                          : hoveredCourse?.course_code === course.course_code
                          ? "border-dashed border-1 bg-schedule-course-bg/50"
                          : "border-solid border-1 bg-schedule-course-bg",
                        "relative p-0 sm:p-2 shadow-lg shadow-schedule-course-border/15 border-schedule-course-border rounded text-[10px] sm:text-xs flex-1 flex flex-col justify-center hover:scale-105 transition-scale duration-300"
                      )}
                    >
                      <Link
                        href={`/course-info/${course.course_code}`}
                        className="h-full flex flex-col justify-center"
                      >
                        <code className="text-center text-[9px] sm:text-[12px] leading-tight">
                          {course.course_code}
                        </code>
                        <p className="font-semibold text-center truncate text-[9px] sm:text-[12px] leading-tight mt-0.5">
                          {course.course_name}
                        </p>
                        <p className="text-center text-[9px] sm:text-[10px] leading-tight mt-0.5">
                          {courseLocation(course.class_time)}
                        </p>
                      </Link>
                      {onRemoveCourse && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-0 right-0 h-3 w-3 sm:h-4 sm:w-4 mt-0.5 mr-0.5 sm:mt-1 sm:mr-1 cursor-pointer opacity-0 hover:opacity-100"
                          onClick={() => onRemoveCourse(course.course_code)}
                        >
                          <X className="h-2 w-2 sm:h-3 sm:w-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
