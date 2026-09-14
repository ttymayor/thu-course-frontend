"use client";

import { type CSSProperties, useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { motion } from "motion/react";
import { CourseDetailDialog } from "@/components/CourseDetailDialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { periodTimeMap, ScheduleGrid, ScheduleGridEntry } from "@/lib/schedule";
import { cn } from "@/lib/utils";
import type { Course } from "@/types/course";

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

interface ConflictEvent {
  entry: ScheduleGridEntry;
  startIndex: number;
  endIndex: number;
  lane: number;
  laneCount: number;
}

interface CellSpan {
  rowSpan: number;
  show: boolean;
  conflictEvents?: ConflictEvent[];
}

const getEntryKey = (entry: ScheduleGridEntry) =>
  `${entry.course.course_code}:${entry.location ?? ""}`;

const isSameCourseList = (a: ScheduleGridEntry[], b: ScheduleGridEntry[]) => {
  if (a.length !== b.length) return false;
  if (a.length === 0) return false;
  const aIds = a
    .map((entry) => getEntryKey(entry))
    .sort()
    .join(",");
  const bIds = b
    .map((entry) => getEntryKey(entry))
    .sort()
    .join(",");
  return aIds === bIds;
};

function assignConflictLanes(events: ConflictEvent[]) {
  const laneEnds: number[] = [];

  events.forEach((event) => {
    let lane = laneEnds.findIndex((endIndex) => endIndex < event.startIndex);

    if (lane === -1) {
      lane = laneEnds.length;
      laneEnds.push(event.endIndex);
    } else {
      laneEnds[lane] = event.endIndex;
    }

    event.lane = lane;
  });

  events.forEach((event) => {
    event.laneCount = laneEnds.length;
  });
}

function getConflictSpans(
  days: string[],
  periods: string[],
  grid: ScheduleGrid,
) {
  const conflictSpans: Record<string, Record<string, ConflictEvent[]>> = {};

  days.forEach((day) => {
    const dayGrid = grid[day] ?? {};
    const entries = new Map<string, ScheduleGridEntry>();
    const events: ConflictEvent[] = [];
    conflictSpans[day] = {};

    periods.forEach((period) => {
      dayGrid[period]?.forEach((entry) => {
        entries.set(getEntryKey(entry), entry);
      });
    });

    entries.forEach((entry, entryKey) => {
      let startIndex: number | null = null;

      periods.forEach((period, periodIndex) => {
        const isScheduled = dayGrid[period]?.some(
          (candidate) => getEntryKey(candidate) === entryKey,
        );

        if (isScheduled && startIndex === null) {
          startIndex = periodIndex;
        } else if (!isScheduled && startIndex !== null) {
          events.push({
            entry,
            startIndex,
            endIndex: periodIndex - 1,
            lane: 0,
            laneCount: 1,
          });
          startIndex = null;
        }
      });

      if (startIndex !== null) {
        events.push({
          entry,
          startIndex,
          endIndex: periods.length - 1,
          lane: 0,
          laneCount: 1,
        });
      }
    });

    const sortedEvents = events.toSorted(
      (a, b) => a.startIndex - b.startIndex || a.endIndex - b.endIndex,
    );
    let component: ConflictEvent[] = [];
    let componentEndIndex = -1;

    sortedEvents.forEach((event) => {
      if (component.length > 0 && event.startIndex > componentEndIndex) {
        if (component.length > 1) {
          assignConflictLanes(component);
          conflictSpans[day][periods[component[0].startIndex]] = component;
        }
        component = [];
        componentEndIndex = -1;
      }

      component.push(event);
      componentEndIndex = Math.max(componentEndIndex, event.endIndex);
    });

    if (component.length > 1) {
      assignConflictLanes(component);
      conflictSpans[day][periods[component[0].startIndex]] = component;
    }
  });

  return conflictSpans;
}

function ScheduleCourseCard({
  entry,
  hoveredCourse,
  isViewingShared,
  onRemoveCourse,
  onSelectCourse,
  className,
  style,
}: {
  entry: ScheduleGridEntry;
  hoveredCourse: Course | null;
  isViewingShared: boolean;
  onRemoveCourse?: (courseCode: string) => void;
  onSelectCourse: (course: Course) => void;
  className?: string;
  style?: CSSProperties;
}) {
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
      style={style}
      className={cn(
        isViewingShared
          ? "bg-secondary/50 border border-dashed"
          : hoveredCourse && hoveredCourse.course_code === course.course_code
            ? "bg-secondary/25 border border-primary/50 border-dashed"
            : "from-secondary/50 to-secondary/75 bg-linear-to-b border border-primary/25 border-solid",
        "transition-all relative flex min-w-0 flex-col justify-center overflow-hidden rounded-md p-0 text-[10px] ease-in-out hover:scale-102 sm:p-2 sm:text-xs",
        className,
      )}
    >
      <button
        type="button"
        className="flex h-full w-full min-w-0 cursor-pointer flex-col justify-center overflow-hidden"
        onClick={() => onSelectCourse(course)}
      >
        <code className="text-secondary-foreground block w-full text-center text-[9px] leading-tight break-all sm:text-[12px] sm:break-normal">
          {course.course_code}
        </code>
        <p className="text-secondary-foreground mt-0.5 w-full text-center text-[9px] leading-tight font-semibold break-all sm:text-[12px] sm:break-normal">
          {course.course_name}
        </p>
        <p className="mt-0.5 w-full text-center text-[9px] leading-tight break-all sm:text-[10px] sm:break-normal">
          {location}
        </p>
      </button>
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
    </motion.div>
  );
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
  const [detailCourse, setDetailCourse] = useState<Course | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const getTimeProgressInPeriod = (period: string): number | null => {
    if (!currentTime) return null;
    const periodInfo = periodTimeMap[period as keyof typeof periodTimeMap];
    if (!periodInfo) return null;

    const [startHours, startMinute] = periodInfo.startTime
      .split(":")
      .map(Number);
    const [endHours, endMinute] = periodInfo.endTime.split(":").map(Number);
    const startMinutes = startHours * 60 + startMinute;
    const endMinutes = endHours * 60 + endMinute;
    const currentMinutes =
      currentTime.getHours() * 60 + currentTime.getMinutes();

    if (currentMinutes >= startMinutes && currentMinutes <= endMinutes) {
      return (currentMinutes - startMinutes) / (endMinutes - startMinutes);
    }

    return null;
  };

  const cellSpans = useMemo(() => {
    const conflictSpans = getConflictSpans(days, periods, grid);
    const spans: Record<string, Record<string, CellSpan>> = {};

    days.forEach((day) => {
      spans[day] = {};

      Object.entries(conflictSpans[day]).forEach(
        ([startPeriod, conflictEvents]) => {
          const startIndex = periods.indexOf(startPeriod);
          const endIndex = Math.max(
            ...conflictEvents.map((event) => event.endIndex),
          );

          spans[day][startPeriod] = {
            rowSpan: endIndex - startIndex + 1,
            show: true,
            conflictEvents,
          };

          for (let index = startIndex + 1; index <= endIndex; index++) {
            spans[day][periods[index]] = { rowSpan: 0, show: false };
          }
        },
      );

      const dayGrid = grid[day] || {};
      for (let i = 0; i < periods.length; i++) {
        const period = periods[i];
        if (spans[day][period]) continue;

        const currentCourses = dayGrid[period] || [];
        let span = 1;

        for (let j = i + 1; j < periods.length; j++) {
          const nextPeriod = periods[j];
          const nextCourses = dayGrid[nextPeriod] || [];

          if (
            spans[day][nextPeriod] ||
            !isSameCourseList(currentCourses, nextCourses)
          ) {
            break;
          }

          span++;
          spans[day][nextPeriod] = { rowSpan: 0, show: false };
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
      const periodIndex = startPeriodIndex + i;
      if (periodIndex >= periods.length) break;
      const progress = getTimeProgressInPeriod(periods[periodIndex]);
      if (progress !== null) {
        return (i + progress) / span;
      }
    }
    return null;
  };

  return (
    <>
      <Table className="w-full min-w-[36rem] table-fixed" ref={tableRef}>
        <TableHeader className="bg-foreground/1">
          <TableRow className="border-foreground/1">
            <TableHead className="w-8 px-1 text-center text-xs font-medium sm:w-16 sm:px-2 sm:text-sm">
              時段
            </TableHead>
            {days.map((day) => (
              <TableHead
                key={day}
                className="border-foreground/1 border-l px-1 text-center text-xs font-medium sm:px-2 sm:text-sm"
              >
                {day}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {periods.map((period, periodIndex) => (
            <TableRow
              key={period}
              className="border-foreground/1 hover:bg-transparent"
            >
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
              {days.map((day) => {
                const { rowSpan, show, conflictEvents } = cellSpans[day][
                  period
                ] || {
                  rowSpan: 1,
                  show: true,
                };

                if (!show) return null;

                const cellProgress = getSpanTimeProgress(periodIndex, rowSpan);
                const showProgressLine =
                  cellProgress !== null && showTimeProgress;

                return (
                  <TableCell
                    key={`${day}-${period}`}
                    rowSpan={rowSpan}
                    className="border-foreground/1 relative h-16 border-l p-0.5 align-top sm:h-20 sm:p-0.5"
                  >
                    {showProgressLine && (
                      <div
                        className="pointer-events-none absolute left-0 z-10 h-0.5 w-full bg-red-500/50"
                        style={{ top: `${cellProgress * 100}%` }}
                      />
                    )}
                    {conflictEvents ? (
                      <div
                        className="grid h-full gap-1"
                        style={{
                          gridTemplateColumns: `repeat(${conflictEvents[0].laneCount}, minmax(0, 1fr))`,
                          gridTemplateRows: `repeat(${rowSpan}, minmax(0, 1fr))`,
                        }}
                      >
                        {conflictEvents.map((event) => (
                          <ScheduleCourseCard
                            key={`${getEntryKey(event.entry)}-${event.startIndex}`}
                            entry={event.entry}
                            hoveredCourse={hoveredCourse}
                            isViewingShared={isViewingShared}
                            onRemoveCourse={onRemoveCourse}
                            onSelectCourse={setDetailCourse}
                            className="h-full min-h-0"
                            style={{
                              gridColumn: event.lane + 1,
                              gridRow: `${event.startIndex - periodIndex + 1} / span ${event.endIndex - event.startIndex + 1}`,
                            }}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="flex h-full flex-col">
                        {grid[day]?.[period]?.map((entry) => (
                          <ScheduleCourseCard
                            key={getEntryKey(entry)}
                            entry={entry}
                            hoveredCourse={hoveredCourse}
                            isViewingShared={isViewingShared}
                            onRemoveCourse={onRemoveCourse}
                            onSelectCourse={setDetailCourse}
                            className="flex-1"
                          />
                        ))}
                      </div>
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <CourseDetailDialog
        course={detailCourse}
        onClose={() => setDetailCourse(null)}
      />
    </>
  );
}
