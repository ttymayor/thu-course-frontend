"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface CourseScheduleData {
  _id: string;
  course_stage: string;
  start_time: string;
  end_time: string;
  result_publish_time: string;
}

type CourseScheduleStatus =
  | "待公告"
  | "未開始"
  | "將開始"
  | "開放中"
  | "已結束";

function getTime(dateStr: string) {
  const time = new Date(dateStr).getTime();
  return Number.isNaN(time) ? null : time;
}

function computeStatus(
  start: string,
  end: string,
  now: number = Date.now(),
): CourseScheduleStatus {
  const s = getTime(start);
  const e = getTime(end);
  if (s === null || e === null) return "待公告";
  if (now < s) return "未開始";
  if (now > e) return "已結束";
  return "開放中";
}

function getNextUpcomingSchedule(
  schedules: CourseScheduleData[],
  now: number = Date.now(),
) {
  return schedules.find((schedule) => {
    const startTime = getTime(schedule.start_time);
    return startTime !== null && startTime > now;
  });
}

function getDisplayStatus(
  item: CourseScheduleData,
  nextUpcomingSchedule: CourseScheduleData | undefined,
  now: number = Date.now(),
) {
  const status = computeStatus(item.start_time, item.end_time, now);
  if (status === "未開始" && item === nextUpcomingSchedule) {
    return "將開始";
  }
  return status;
}

function getStatusDotClass(status: CourseScheduleStatus) {
  if (status === "開放中") {
    return "animate-ping-opacity bg-green-500";
  }

  if (status === "將開始") {
    return "bg-yellow-400";
  }

  return "bg-gray-400";
}

function CourseScheduleTimeline({
  schedules,
  nextUpcomingSchedule,
  now,
}: {
  schedules: CourseScheduleData[];
  nextUpcomingSchedule: CourseScheduleData | undefined;
  now: number;
}) {
  return (
    <ol className="w-[max(15rem,calc(30vw))]">
      {schedules.map((item, idx) => {
        const status = getDisplayStatus(item, nextUpcomingSchedule, now);
        const isLast = idx === schedules.length - 1;
        const isFirst = idx === 0;

        return (
          <li
            key={item._id || idx}
            className="grid grid-cols-[1rem_minmax(0,1fr)] gap-3 pb-4 last:pb-0"
          >
            <div className="relative flex justify-center pt-4">
              {!isLast && (
                <div className="bg-foreground/10 absolute top-7.5 -bottom-7 w-px" />
              )}
              <div
                className={`bg-muted-foreground relative z-10 size-2.5 rounded-full`}
              />
            </div>

            <div
              className={`ring-foreground/10 min-w-0 rounded-sm p-3 ring-1 ${isFirst ? "bg-white/5 " : "bg-card/5"}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <p className="min-w-0 text-sm font-medium wrap-break-word">
                  {item.course_stage}
                </p>
                <Badge
                  variant="outline"
                  className="ring-foreground/10 bg-card shrink-0 border-none ring-1"
                >
                  <div
                    className={`size-2 rounded-full ${getStatusDotClass(status)}`}
                  />
                  {status}
                </Badge>
              </div>

              <dl className="mt-3 grid gap-2 text-xs sm:grid-cols-3">
                <div>
                  <dt className="text-muted-foreground">開始</dt>
                  <dd className="mt-0.5 font-medium">
                    {formatDate(item.start_time)}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">結束</dt>
                  <dd className="mt-0.5 font-medium">
                    {formatDate(item.end_time)}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">公布</dt>
                  <dd className="mt-0.5 font-medium">
                    {formatDate(item.result_publish_time)}
                  </dd>
                </div>
              </dl>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function formatDate(dateStr: string) {
  const time = getTime(dateStr);
  if (time === null) return "待公告";
  // Manual UTC+8 conversion to avoid locale-dependent hydration mismatch
  const taipei = new Date(time + 8 * 60 * 60 * 1000);
  const y = taipei.getUTCFullYear();
  const mo = String(taipei.getUTCMonth() + 1).padStart(2, "0");
  const d = String(taipei.getUTCDate()).padStart(2, "0");
  const h = String(taipei.getUTCHours()).padStart(2, "0");
  const mi = String(taipei.getUTCMinutes()).padStart(2, "0");
  return `${y}/${mo}/${d} ${h}:${mi}`;
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

function TimeLeft({ endTime }: { endTime: string }) {
  const end = new Date(endTime).getTime();
  const [msLeft, setMsLeft] = useState(() => end - Date.now());

  useEffect(() => {
    const interval = msLeft < 3600_000 ? 1000 : 60_000;
    const timer = setInterval(() => setMsLeft(end - Date.now()), interval);
    return () => clearInterval(timer);
  }, [end, msLeft < 3600_000]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <span className="text-muted-foreground inline text-[10px]">
      {formatTimeLeft(msLeft)}
    </span>
  );
}

function TimeUntilStart({ startTime }: { startTime: string }) {
  const start = new Date(startTime).getTime();
  const [msLeft, setMsLeft] = useState(() => start - Date.now());

  useEffect(() => {
    const interval = msLeft < 3600_000 ? 1000 : 60_000;
    const timer = setInterval(() => setMsLeft(start - Date.now()), interval);
    return () => clearInterval(timer);
  }, [start, msLeft < 3600_000]); // eslint-disable-line react-hooks/exhaustive-deps

  return <span>{formatTimeUntilStart(msLeft)}</span>;
}

function pickSchedule(
  schedules: CourseScheduleData[],
  now: number = Date.now(),
): CourseScheduleData | "ended" {
  const sorted = [...schedules].sort(
    (a, b) =>
      (getTime(a.start_time) ?? Infinity) - (getTime(b.start_time) ?? Infinity),
  );
  const active = sorted.find(
    (s) => computeStatus(s.start_time, s.end_time, now) === "開放中",
  );
  if (active) return active;
  const next = getNextUpcomingSchedule(sorted, now);
  if (next) return next;
  const pending = sorted.find(
    (s) => computeStatus(s.start_time, s.end_time, now) === "待公告",
  );
  if (pending) return pending;
  return "ended";
}

export default function CourseScheduleTable({
  schedules,
}: {
  schedules: CourseScheduleData[];
}) {
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    setMounted(true);
    setNow(Date.now());
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const picked = mounted ? pickSchedule(schedules, now) : null;

  const sorted = [...schedules].sort(
    (a, b) =>
      (getTime(a.start_time) ?? Infinity) - (getTime(b.start_time) ?? Infinity),
  );
  const visibleSchedules = sorted.every(
    (item) => computeStatus(item.start_time, item.end_time, now) === "已結束",
  )
    ? sorted
    : sorted.filter(
        (item) =>
          computeStatus(item.start_time, item.end_time, now) !== "已結束",
      );
  const nextUpcomingSchedule = getNextUpcomingSchedule(visibleSchedules, now);

  if (!mounted || picked === null) {
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
          <>
            <span>
              開放中
              <TimeLeft endTime={picked.end_time} />
            </span>
          </>
        ) : (
          <span className="text-muted-foreground">
            {pickedStatus === "待公告" ? (
              "待公告"
            ) : (
              <TimeUntilStart startTime={picked.start_time} />
            )}
          </span>
        )}
      </Badge>
    );

  return (
    <Popover>
      <PopoverTrigger asChild>{badge}</PopoverTrigger>
      <PopoverContent
        align="start"
        className="ring-foreground/10 bg-card/80 w-auto max-w-[90vw] rounded-lg border-none ring-1 backdrop-blur-xl"
      >
        <p className="text-muted-foreground mb-2 text-sm tracking-wide uppercase">
          選課時程表
        </p>
        <CourseScheduleTimeline
          schedules={visibleSchedules}
          nextUpcomingSchedule={nextUpcomingSchedule}
          now={now}
        />
      </PopoverContent>
    </Popover>
  );
}
