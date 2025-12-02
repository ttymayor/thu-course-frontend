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
import { useState, useEffect } from "react";

interface ScheduleTableProps {
  tableRef?: React.RefObject<HTMLTableElement | null>;
  days: string[];
  periods: string[];
  grid: ScheduleGrid;
  hoveredCourse: CourseData | null;
  isViewingShared: boolean;
  onRemoveCourse?: (courseCode: string) => void;
  onCourseHover?: (hoveredCourse: CourseData | null) => void;
  showTimeProgress?: boolean;
}

export default function ScheduleTable({
  tableRef,
  days,
  periods,
  grid,
  hoveredCourse,
  isViewingShared,
  onRemoveCourse,
  showTimeProgress = false,
}: ScheduleTableProps) {
  const [currentTime, setCurrentTime] = useState<Date | null>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const timeToMinutes = (timeStr: string): number => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const getTimeProgressInPeriod = (period: string): number | null => {
    if (!currentTime) return null;
    const periodInfo = periodTimeMap[period as keyof typeof periodTimeMap];
    if (!periodInfo) return null;

    const currentMinutes =
      currentTime.getHours() * 60 + currentTime.getMinutes();
    const startMinutes = timeToMinutes(periodInfo.startTime);
    const endMinutes = timeToMinutes(periodInfo.endTime);

    if (currentMinutes >= startMinutes && currentMinutes <= endMinutes) {
      return (currentMinutes - startMinutes) / (endMinutes - startMinutes);
    }

    return null;
  };

  return (
    <Table className="bg-card w-full table-fixed" ref={tableRef}>
      <TableHeader>
        <TableRow>
          <TableHead className="w-8 px-1 text-center text-xs font-medium sm:w-16 sm:px-2 sm:text-sm">
            時段
          </TableHead>
          {days.map((day) => (
            <TableHead
              key={day}
              className="px-1 text-center text-xs font-medium sm:px-2 sm:text-sm"
            >
              {day}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {periods.map((period) => {
          const timeProgress = getTimeProgressInPeriod(period);
          const isCurrentPeriod = timeProgress !== null;

          return (
            <TableRow key={period}>
              <TableCell className="px-1 py-2 text-center font-medium sm:px-2 sm:py-3">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold sm:text-sm">
                    {periodTimeMap[period as keyof typeof periodTimeMap].period}
                  </span>
                  <span className="text-muted-foreground text-[10px] sm:text-xs">
                    {
                      periodTimeMap[period as keyof typeof periodTimeMap]
                        .startTime
                    }
                  </span>
                  <span className="text-muted-foreground text-[10px] sm:text-xs">
                    {
                      periodTimeMap[period as keyof typeof periodTimeMap]
                        .endTime
                    }
                  </span>
                </div>
              </TableCell>
              {days.map((day) => (
                <TableCell
                  key={`${day}-${period}`}
                  className="relative h-16 p-1 align-top sm:h-20 sm:p-2"
                >
                  {/* 現在時間指示線 */}
                  {isCurrentPeriod && showTimeProgress && (
                    <div
                      className="pointer-events-none absolute left-0 z-10 h-0.5 w-full bg-red-500/50"
                      style={{
                        top: `${timeProgress! * 100}%`,
                      }}
                    >
                      {/* <div className="absolute left-0 w-1 h-1 bg-red-500 rounded-full -translate-y-1/3" />
                      <div className="absolute right-0 w-1 h-1 bg-red-500 rounded-full -translate-y-1/3" /> */}
                    </div>
                  )}
                  <div className="flex h-full flex-col">
                    {grid[day]?.[period]?.map((course: CourseData) => (
                      <div
                        key={course.course_code}
                        className={cn(
                          isViewingShared
                            ? "bg-schedule-course-bg/50 border-1 border-dashed"
                            : hoveredCourse?.course_code === course.course_code
                              ? "bg-schedule-course-bg/50 border-1 border-dashed"
                              : "bg-schedule-course-bg border-1 border-solid",
                          "shadow-schedule-course-border/15 border-schedule-course-border transition-scale relative flex flex-1 flex-col justify-center rounded p-0 text-[10px] shadow-lg duration-300 hover:scale-105 sm:p-2 sm:text-xs",
                        )}
                      >
                        <Link
                          href={`/course-info/${course.course_code}`}
                          className="flex h-full flex-col justify-center"
                        >
                          <code className="text-center text-[9px] leading-tight sm:text-[12px]">
                            {course.course_code}
                          </code>
                          <p className="mt-0.5 truncate text-center text-[9px] leading-tight font-semibold sm:text-[12px]">
                            {course.course_name}
                          </p>
                          <p className="mt-0.5 text-center text-[9px] leading-tight sm:text-[10px]">
                            {courseLocation(course.class_time)}
                          </p>
                        </Link>
                        {onRemoveCourse && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-0 right-0 mt-0.5 mr-0.5 h-3 w-3 cursor-pointer opacity-0 hover:opacity-100 sm:mt-1 sm:mr-1 sm:h-4 sm:w-4"
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
          );
        })}
      </TableBody>
    </Table>
  );
}
