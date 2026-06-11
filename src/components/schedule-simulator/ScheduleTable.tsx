"use client";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { periodTimeMap, ScheduleGrid, ScheduleGridEntry } from "@/lib/schedule";
import { Button } from "@/components/ui/button";
import { CourseDetailDialog } from "@/components/CourseDetailDialog";
import { X } from "lucide-react";
import type { Course } from "@/types/course";
import { useState, useEffect, useMemo } from "react";
import { motion } from "motion/react";

interface ScheduleTableProps {
  tableRef?: React.RefObject<HTMLTableElement | null>;
  days: string[];
  periods: string[];
  grid: ScheduleGrid;
  hoveredCourse: Course | null;
  isViewingShared: boolean;
  onRemoveCourse?: (courseCode: string) => void;
  onCourseHover?: (hoveredCourse: Course | null) => void;
  showTimeProgress?: boolean;
}

const isSameCourseList = (a: ScheduleGridEntry[], b: ScheduleGridEntry[]) => {
  if (a.length !== b.length) return false;
  if (a.length === 0) return false;
  const aIds = a
    .map((entry) => `${entry.course.course_code}:${entry.location ?? ""}`)
    .sort()
    .join(",");
  const bIds = b
    .map((entry) => `${entry.course.course_code}:${entry.location ?? ""}`)
    .sort()
    .join(",");
  return aIds === bIds;
};

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
  const [detailCode, setDetailCode] = useState<string | null>(null);

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

  const cellSpans = useMemo(() => {
    const spans: Record<
      string,
      Record<string, { rowSpan: number; show: boolean }>
    > = {};

    days.forEach((day) => {
      spans[day] = {};
      const dayGrid = grid[day] || {};

      for (let i = 0; i < periods.length; i++) {
        const period = periods[i];
        if (spans[day][period]) continue;

        const currentCourses = dayGrid[period] || [];
        let span = 1;

        for (let j = i + 1; j < periods.length; j++) {
          const nextPeriod = periods[j];
          const nextCourses = dayGrid[nextPeriod] || [];

          if (isSameCourseList(currentCourses, nextCourses)) {
            span++;
            spans[day][nextPeriod] = { rowSpan: 0, show: false };
          } else {
            break;
          }
        }
        spans[day][period] = { rowSpan: span, show: true };
      }
    });
    return spans;
  }, [days, periods, grid]);

  const getSpanTimeProgress = (
    startPeriodIndex: number,
    span: number,
  ): number | null => {
    for (let i = 0; i < span; i++) {
      const pIndex = startPeriodIndex + i;
      if (pIndex >= periods.length) break;
      const p = periods[pIndex];
      const progress = getTimeProgressInPeriod(p);
      if (progress !== null) {
        return (i + progress) / span;
      }
    }
    return null;
  };

  return (
    <>
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
          {periods.map((period, periodIndex) => {
            return (
              <TableRow key={period} className="hover:bg-transparent">
                <TableCell className="px-1 py-2 text-center font-medium sm:px-2 sm:py-3">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold sm:text-sm">
                      {
                        periodTimeMap[period as keyof typeof periodTimeMap]
                          .period
                      }
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
                {days.map((day) => {
                  const { rowSpan, show } = cellSpans[day][period] || {
                    rowSpan: 1,
                    show: true,
                  };

                  if (!show) return null;

                  const cellProgress = getSpanTimeProgress(
                    periodIndex,
                    rowSpan,
                  );
                  const showProgressLine =
                    cellProgress !== null && showTimeProgress;

                  return (
                    <TableCell
                      key={`${day}-${period}`}
                      rowSpan={rowSpan}
                      className="relative h-16 p-1 align-top sm:h-20 sm:p-2"
                    >
                      {showProgressLine && (
                        <div
                          className="pointer-events-none absolute left-0 z-10 h-0.5 w-full bg-red-500/50"
                          style={{
                            top: `${cellProgress * 100}%`,
                          }}
                        ></div>
                      )}
                      <div className="flex h-full flex-col">
                        {grid[day]?.[period]?.map((entry) => {
                          const { course, location } = entry;

                          return (
                            <motion.div
                              initial={{
                                opacity: 0,
                                scale: 0,
                                filter: "blur(5px)",
                              }}
                              whileInView={{
                                opacity: 1,
                                scale: 1,
                                filter: "blur(0px)",
                              }}
                              transition={{
                                delay: Math.random() * 0.1,
                                duration: 0.1,
                              }}
                              viewport={{ once: true }}
                              key={`${course.course_code}-${location ?? ""}`}
                              className={cn(
                                isViewingShared
                                  ? "bg-secondary/50 border border-dashed"
                                  : hoveredCourse &&
                                      hoveredCourse.course_code ===
                                        course.course_code
                                    ? "bg-secondary/50 border border-dashed"
                                    : "bg-secondary border border-solid",
                                "transition-all relative flex flex-1 flex-col justify-center rounded-md p-0 text-[10px] ease-in-out hover:scale-102 sm:p-2 sm:text-xs",
                              )}
                            >
                              <button
                                className="flex h-full w-full cursor-pointer flex-col justify-center"
                                onClick={() =>
                                  setDetailCode(course.course_code)
                                }
                              >
                                <code className="text-secondary-foreground text-center text-[9px] leading-tight sm:text-[12px]">
                                  {course.course_code}
                                </code>
                                <p className="text-secondary-foreground mt-0.5 text-center text-[9px] leading-tight font-semibold text-pretty sm:text-[12px]">
                                  {course.course_name}
                                </p>
                                <p className="mt-0.5 text-center text-[9px] leading-tight sm:text-[10px]">
                                  {location}
                                </p>
                              </button>
                              {onRemoveCourse && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="absolute top-0 right-0 mt-0.5 mr-0.5 h-3 w-3 cursor-pointer opacity-0 hover:opacity-100 sm:mt-1 sm:mr-1 sm:h-4 sm:w-4"
                                  onClick={() =>
                                    onRemoveCourse(course.course_code)
                                  }
                                >
                                  <X className="h-2 w-2 sm:h-3 sm:w-3" />
                                </Button>
                              )}
                            </motion.div>
                          );
                        })}
                      </div>
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <CourseDetailDialog
        courseCode={detailCode}
        onClose={() => setDetailCode(null)}
      />
    </>
  );
}
