"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

function computeStatus(start: string, end: string): "關閉" | "開放" | "結束" {
  const now = Date.now();
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  if (now < s) return "關閉";
  if (now > e) return "結束";
  return "開放";
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  // Manual UTC+8 conversion to avoid locale-dependent hydration mismatch
  const taipei = new Date(date.getTime() + 8 * 60 * 60 * 1000);
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
  if (days > 0) return `（將於 ${days} 天 ${hours} 小時後結束）`;
  if (hours > 0) return `（將於 ${hours} 小時 ${minutes} 分後結束）`;
  if (minutes > 0) return `（將於 ${minutes} 分 ${seconds} 秒後結束）`;
  return `（將於 ${seconds} 秒後結束）`;
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
    <span className="text-muted-foreground hidden sm:inline">
      {formatTimeLeft(msLeft)}
    </span>
  );
}

function pickSchedule(
  schedules: CourseScheduleData[]
): CourseScheduleData | "ended" {
  const now = Date.now();
  const sorted = [...schedules].sort(
    (a, b) =>
      new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
  );
  const active = sorted.find(
    (s) => computeStatus(s.start_time, s.end_time) === "開放"
  );
  if (active) return active;
  const next = sorted.find((s) => new Date(s.start_time).getTime() > now);
  if (next) return next;
  return "ended";
}

export default function CourseScheduleTable({
  schedules,
}: {
  schedules: CourseScheduleData[];
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const picked = mounted ? pickSchedule(schedules) : null;

  const sorted = [...schedules].sort(
    (a, b) =>
      new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
  );

  if (!mounted || picked === null) {
    return <Skeleton className="h-5 w-32 rounded-full" />;
  }

  const isActive =
    picked !== "ended" &&
    computeStatus(picked.start_time, picked.end_time) === "開放";

  const badge =
    picked === "ended" ? (
      <Badge variant="outline" className="cursor-pointer select-none">
        <div className="size-2 rounded-full bg-gray-400" />
        該學期選課階段已完結
      </Badge>
    ) : (
      <Badge variant="outline" className="cursor-pointer gap-1.5 select-none">
        {isActive ? (
          <div className="animate-ping-opacity size-2 rounded-full bg-green-500" />
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
            {formatDate(picked.start_time)} 開始
          </span>
        )}
      </Badge>
    );

  return (
    <Popover>
      <PopoverTrigger asChild>{badge}</PopoverTrigger>
      <PopoverContent
        align="start"
        className="mr-2 w-auto max-w-[90vw] space-y-2"
      >
        <p className="text-muted-foreground text-sm tracking-wide uppercase">
          選課時程表
        </p>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>階段</TableHead>
              <TableHead>狀態</TableHead>
              <TableHead>開始時間</TableHead>
              <TableHead>結束時間</TableHead>
              <TableHead>結果公布時間</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((item, idx) => {
              const status = computeStatus(item.start_time, item.end_time);
              return (
                <TableRow key={item._id || idx}>
                  <TableCell className="font-medium">
                    {item.course_stage}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {status === "開放" ? (
                        <div className="animate-ping-opacity size-2 rounded-full bg-green-500" />
                      ) : (
                        <div className="size-2 rounded-full bg-gray-400" />
                      )}
                      {status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(item.start_time)}</TableCell>
                  <TableCell>{formatDate(item.end_time)}</TableCell>
                  <TableCell>{formatDate(item.result_publish_time)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </PopoverContent>
    </Popover>
  );
}
