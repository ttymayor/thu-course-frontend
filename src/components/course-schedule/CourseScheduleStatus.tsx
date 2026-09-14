"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ComponentProps,
} from "react";
import { zhTW } from "react-day-picker/locale";

import { Badge } from "@/components/ui/badge";
import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useHydrated } from "@/hooks/useHydrated";
import { cn } from "@/lib/utils";
import type { CourseSchedule } from "@/types/courseSchedule";

type ScheduleStatus = "待公告" | "未開始" | "將開始" | "開放中" | "已結束";

function getTime(dateStr: string) {
  const time = new Date(dateStr).getTime();
  return Number.isNaN(time) ? null : time;
}

const TAIPEI_OFFSET_MS = 8 * 60 * 60 * 1000;
const MAX_VISIBLE_DAY_SEGMENTS = 3;

function getTaipeiDate(time: number) {
  return new Date(time + TAIPEI_OFFSET_MS);
}

function getTaipeiDayKey(dateStr: string) {
  const time = getTime(dateStr);
  if (time === null) return null;
  const date = getTaipeiDate(time);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getCalendarDayKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getCalendarDate(time: number) {
  const date = getTaipeiDate(time);
  return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

function getScheduleDayRange(schedule: CourseSchedule) {
  const start = getTaipeiDayKey(schedule.start_time);
  const end = getTaipeiDayKey(schedule.end_time);
  if (start === null || end === null || start > end) return null;
  return { start, end };
}

function getSchedulesForDay(schedules: CourseSchedule[], date: Date) {
  const dayKey = getCalendarDayKey(date);
  return schedules.filter((schedule) => {
    const range = getScheduleDayRange(schedule);
    return range !== null && dayKey >= range.start && dayKey <= range.end;
  });
}

function getSchedulesPublishingOnDay(schedules: CourseSchedule[], date: Date) {
  const dayKey = getCalendarDayKey(date);
  return schedules.filter(
    (schedule) => getTaipeiDayKey(schedule.result_publish_time) === dayKey,
  );
}

function getSchedulesForStatusDay(schedules: CourseSchedule[], date: Date) {
  const dayKey = getCalendarDayKey(date);
  return schedules.filter((schedule) => {
    const range = getScheduleDayRange(schedule);
    const isActiveDay =
      range !== null && dayKey >= range.start && dayKey <= range.end;
    return (
      isActiveDay || getTaipeiDayKey(schedule.result_publish_time) === dayKey
    );
  });
}

function computeStatus(
  start: string,
  end: string,
  now: number = Date.now(),
): ScheduleStatus {
  const s = getTime(start);
  const e = getTime(end);
  if (s === null || e === null) return "待公告";
  if (now < s) return "未開始";
  if (now > e) return "已結束";
  return "開放中";
}

function getNextUpcomingSchedule(
  schedules: CourseSchedule[],
  now: number = Date.now(),
) {
  return schedules.find((schedule) => {
    const startTime = getTime(schedule.start_time);
    return startTime !== null && startTime > now;
  });
}

function getDisplayStatus(
  item: CourseSchedule,
  nextUpcomingSchedule: CourseSchedule | undefined,
  now: number = Date.now(),
) {
  const status = computeStatus(item.start_time, item.end_time, now);
  if (status === "未開始" && item === nextUpcomingSchedule) {
    return "將開始";
  }
  return status;
}

interface ScheduleCalendarContextValue {
  schedules: CourseSchedule[];
  nextUpcomingSchedule: CourseSchedule | undefined;
  now: number;
}

const ScheduleCalendarContext =
  createContext<ScheduleCalendarContextValue | null>(null);

function getStatusSegmentClass(status: ScheduleStatus) {
  if (status === "開放中") return "bg-primary";
  if (status === "將開始" || status === "未開始") {
    return "bg-secondary-foreground/60";
  }
  return "bg-muted-foreground/40";
}

function ScheduleCalendarDayButton({
  className,
  day,
  modifiers,
  children,
  ...props
}: ComponentProps<typeof CalendarDayButton>) {
  const context = useContext(ScheduleCalendarContext);
  const schedules = context
    ? getSchedulesForDay(context.schedules, day.date)
    : [];
  const publishingSchedules = context
    ? getSchedulesPublishingOnDay(context.schedules, day.date)
    : [];
  const visibleSchedules =
    schedules.length > MAX_VISIBLE_DAY_SEGMENTS
      ? schedules.slice(0, MAX_VISIBLE_DAY_SEGMENTS - 1)
      : schedules;
  const hiddenScheduleCount = schedules.length - visibleSchedules.length;
  const dayKey = getCalendarDayKey(day.date);
  const isWeekStart = day.date.getDay() === 0;
  const isWeekEnd = day.date.getDay() === 6;

  return (
    <CalendarDayButton
      className={cn(
        "pb-3 data-[selected-single=true]:bg-accent data-[selected-single=true]:text-accent-foreground",
        className,
      )}
      day={day}
      modifiers={modifiers}
      {...props}
    >
      <span className={cn(modifiers.outside && "text-muted-foreground/50")}>
        {children}
      </span>
      {schedules.length > 0 && context && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-1 flex flex-col gap-px"
        >
          {visibleSchedules.map((schedule) => {
            const range = getScheduleDayRange(schedule);
            if (range === null) return null;
            const status = getDisplayStatus(
              schedule,
              context.nextUpcomingSchedule,
              context.now,
            );

            return (
              <span
                key={schedule._id}
                className={cn(
                  "h-1",
                  getStatusSegmentClass(status),
                  (dayKey === range.start || isWeekStart) &&
                    "ml-1 rounded-l-full",
                  (dayKey === range.end || isWeekEnd) && "mr-1 rounded-r-full",
                )}
              />
            );
          })}
          {hiddenScheduleCount > 0 && (
            <span className="text-muted-foreground text-[8px] leading-none">
              +{hiddenScheduleCount}
            </span>
          )}
        </span>
      )}
      {publishingSchedules.length > 0 && (
        <span
          aria-hidden="true"
          className="bg-primary pointer-events-none absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full"
        />
      )}
    </CalendarDayButton>
  );
}

function formatCalendarDate(date: Date) {
  const chineseNums = ["日", "一", "二", "三", "四", "五", "六"];
  return `${date.getMonth() + 1} 月 ${date.getDate()} 日（${chineseNums[date.getDay()]}）`;
}

function getStatusBadgeVariant(
  status: ScheduleStatus,
): "default" | "secondary" | "outline" {
  if (status === "開放中") return "default";
  if (status === "未開始" || status === "將開始") return "secondary";
  return "outline";
}

function ScheduleStatusPanel({
  date,
  schedules,
  nextUpcomingSchedule,
  now,
}: {
  date: Date;
  schedules: CourseSchedule[];
  nextUpcomingSchedule: CourseSchedule | undefined;
  now: number;
}) {
  const selectedSchedules = getSchedulesForStatusDay(schedules, date);

  return (
    <Card size="sm" className="min-h-fit min-w-0 flex-1">
      <CardHeader className="border-b">
        <CardTitle className="text-center">
          {formatCalendarDate(date)}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {selectedSchedules.length === 0 ? (
          <Empty className="min-h-40 p-4">
            <EmptyHeader>
              <EmptyTitle>當日沒有選課活動</EmptyTitle>
              <EmptyDescription>
                請選擇有線段標記的日期查看活動狀態。
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          selectedSchedules.map((schedule, index) => {
            const status = getDisplayStatus(
              schedule,
              nextUpcomingSchedule,
              now,
            );

            return (
              <div key={schedule._id} className="flex flex-col gap-4">
                {index > 0 && <Separator />}
                <section className="flex flex-col gap-2 rounded-md">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h3 className="font-medium">
                      {schedule.course_stage}
                      <span className="text-muted-foreground ml-1 font-normal">
                        {formatMonthDay(schedule.start_time)}~
                        {formatMonthDay(schedule.end_time)}
                      </span>
                    </h3>
                    <Badge variant={getStatusBadgeVariant(status)}>
                      {status}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    公布日：
                    <span className="font-medium">
                      {formatMonthDay(schedule.result_publish_time)}
                    </span>
                  </p>
                </section>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}

function getDefaultSelectedDate(schedules: CourseSchedule[], now: number) {
  const active = schedules.find(
    (schedule) =>
      computeStatus(schedule.start_time, schedule.end_time, now) === "開放中",
  );
  if (active) return getCalendarDate(now);

  const next = getNextUpcomingSchedule(schedules, now);
  const nextStart = next ? getTime(next.start_time) : null;
  if (nextStart !== null) return getCalendarDate(nextStart);

  const lastValidEnd = schedules.reduce<number | null>((latest, schedule) => {
    const end = getTime(schedule.end_time);
    if (end === null) return latest;
    return latest === null || end > latest ? end : latest;
  }, null);
  return getCalendarDate(lastValidEnd ?? now);
}

function CourseScheduleCalendar({
  schedules,
  nextUpcomingSchedule,
  now,
}: ScheduleCalendarContextValue) {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const defaultDate = selectedDate ?? getDefaultSelectedDate(schedules, now);

  return (
    <ScheduleCalendarContext.Provider
      value={{ schedules, nextUpcomingSchedule, now }}
    >
      <div className="flex flex-col gap-3 sm:flex-row">
        <Calendar
          mode="single"
          required
          selected={defaultDate}
          onSelect={setSelectedDate}
          defaultMonth={defaultDate}
          today={getCalendarDate(now)}
          locale={zhTW}
          weekStartsOn={0}
          fixedWeeks
          className="mx-auto w-full p-0 [--cell-size:--spacing(10)] sm:max-w-fit"
          components={{ DayButton: ScheduleCalendarDayButton }}
        />
        <ScheduleStatusPanel
          date={defaultDate}
          schedules={schedules}
          nextUpcomingSchedule={nextUpcomingSchedule}
          now={now}
        />
      </div>
    </ScheduleCalendarContext.Provider>
  );
}

function formatMonthDay(dateStr: string) {
  const time = getTime(dateStr);
  if (time === null) return "待公告";
  const taipei = getTaipeiDate(time);
  const month = String(taipei.getUTCMonth() + 1).padStart(2, "0");
  const day = String(taipei.getUTCDate()).padStart(2, "0");
  return `${month}/${day}`;
}

function formatTimeLeft(ms: number): string {
  if (ms <= 0) return "即將結束";
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (days > 0) return `（於 ${days} 天 ${hours} 小時後結束）`;
  if (hours > 0) return `（於 ${hours} 小時 ${minutes} 分後結束）`;
  if (minutes > 0) return `（於 ${minutes} 分 ${seconds} 秒後結束）`;
  return `（於 ${seconds} 秒後結束）`;
}

function formatTimeUntilStart(ms: number): string {
  if (ms <= 0) return "即將開始";
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (days > 0) return `將於 ${days} 天 ${hours} 小時後開始`;
  if (hours > 0) return `將於 ${hours} 小時 ${minutes} 分後開始`;
  if (minutes > 0) return `將於 ${minutes} 分 ${seconds} 秒後開始`;
  return `將於 ${seconds} 秒後開始`;
}

function compareByStartTime(a: CourseSchedule, b: CourseSchedule) {
  return (
    (getTime(a.start_time) ?? Infinity) - (getTime(b.start_time) ?? Infinity)
  );
}

function pickSchedule(
  schedules: CourseSchedule[],
  now: number = Date.now(),
): CourseSchedule | "ended" {
  const active = schedules.find(
    (schedule) =>
      computeStatus(schedule.start_time, schedule.end_time, now) === "開放中",
  );
  if (active) return active;
  const next = getNextUpcomingSchedule(schedules, now);
  if (next) return next;
  const pending = schedules.find(
    (schedule) =>
      computeStatus(schedule.start_time, schedule.end_time, now) === "待公告",
  );
  if (pending) return pending;
  return "ended";
}

export default function CourseScheduleStatus({
  schedules,
}: {
  schedules: CourseSchedule[];
}) {
  const hydrated = useHydrated();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const sortedSchedules = useMemo(
    () =>
      schedules.toSorted?.(compareByStartTime) ??
      schedules.slice().sort(compareByStartTime),
    [schedules],
  );
  const picked = hydrated ? pickSchedule(sortedSchedules, now) : null;
  const nextUpcomingSchedule = getNextUpcomingSchedule(sortedSchedules, now);

  if (!hydrated || picked === null) {
    return <Skeleton className="h-5 w-32 rounded-full" />;
  }

  const pickedStatus =
    picked === "ended"
      ? null
      : computeStatus(picked.start_time, picked.end_time, now);
  const isActive = pickedStatus === "開放中";

  const badge =
    picked === "ended" ? (
      <Badge
        variant="outline"
        className="border-foreground/10 bg-card cursor-pointer select-none"
      >
        <div
          data-icon="inline-start"
          className="size-2 rounded-full bg-gray-400"
        />
        該學期選課階段已完結
      </Badge>
    ) : (
      <Badge
        variant="outline"
        className="border-foreground/10 bg-card cursor-pointer gap-1.5 select-none"
      >
        {isActive ? (
          <div className="animate-ping-opacity size-2 rounded-full bg-green-500" />
        ) : pickedStatus === "待公告" ? (
          <div className="size-2 rounded-full bg-gray-400" />
        ) : (
          <div className="size-2 rounded-full bg-yellow-400" />
        )}
        {picked.course_stage}
        <span className="text-muted-foreground">·</span>
        {isActive ? (
          <span>
            開放中
            <span className="text-muted-foreground text-[10px]">
              {formatTimeLeft((getTime(picked.end_time) ?? now) - now)}
            </span>
          </span>
        ) : (
          <span className="text-muted-foreground">
            {pickedStatus === "待公告"
              ? "待公告"
              : formatTimeUntilStart((getTime(picked.start_time) ?? now) - now)}
          </span>
        )}
      </Badge>
    );

  return (
    <div className="flex w-full flex-row items-center gap-2 sm:gap-4">
      <Separator className="flex-1" />
      <Popover>
        <PopoverTrigger
          render={
            <button
              type="button"
              className="inline-flex cursor-pointer appearance-none bg-transparent p-0 text-left"
            >
              {badge}
            </button>
          }
        />
        <PopoverContent className="ring-foreground/10 bg-card/90 max-h-[min(42rem,calc(100vh-2rem))] w-[min(42rem,calc(100vw-2rem))] overflow-y-auto rounded-3xl border-none p-3 ring-1 backdrop-blur-xl">
          <CourseScheduleCalendar
            schedules={sortedSchedules}
            nextUpcomingSchedule={nextUpcomingSchedule}
            now={now}
          />
        </PopoverContent>
      </Popover>
      <Separator className="flex-1" />
    </div>
  );
}
