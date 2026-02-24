"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

  // Manual UTC+8 conversion to avoid locale-dependent output that causes hydration mismatch
  const taipei = new Date(date.getTime() + 8 * 60 * 60 * 1000);
  const y = taipei.getUTCFullYear();
  const mo = String(taipei.getUTCMonth() + 1).padStart(2, "0");
  const d = String(taipei.getUTCDate()).padStart(2, "0");
  const h = String(taipei.getUTCHours()).padStart(2, "0");
  const mi = String(taipei.getUTCMinutes()).padStart(2, "0");
  return `${y}/${mo}/${d} ${h}:${mi}`;
}

export default function CourseScheduleTable({
  schedules,
}: {
  schedules: CourseScheduleData[];
}) {
  return (
    <Card className="w-full max-w-5xl rounded-lg border-0">
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px] text-center">階段</TableHead>
              <TableHead className="text-center">狀態</TableHead>
              <TableHead className="text-center">開始時間</TableHead>
              <TableHead className="text-center">結束時間</TableHead>
              <TableHead className="text-center">結果公布時間</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schedules?.map((item: CourseScheduleData, idx: number) => {
              const status = computeStatus(item.start_time, item.end_time);
              return (
                <TableRow key={item._id || idx}>
                  <TableCell className="text-center font-medium">
                    {item.course_stage}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline">
                      {status === "開放" ? (
                        <div className="animate-ping-opacity size-2 rounded-full bg-green-500"></div>
                      ) : (
                        <div className="size-2 rounded-full bg-gray-500"></div>
                      )}
                      {status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {formatDate(item.start_time)}
                  </TableCell>
                  <TableCell className="text-center">
                    {formatDate(item.end_time)}
                  </TableCell>
                  <TableCell className="text-center">
                    {formatDate(item.result_publish_time)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
