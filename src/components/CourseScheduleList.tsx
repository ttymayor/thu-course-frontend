"use cache";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCourseSchedules } from "@/lib/courseSchedule";

interface CourseScheduleData {
  _id: string;
  course_stage: string;
  status: string;
  start_time: string;
  end_time: string;
  result_publish_time: string;
}

export default async function CourseScheduleList() {
  const schedules = await getCourseSchedules();

  return (
    <Card className="w-full max-w-5xl">
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
            {schedules?.map((item: CourseScheduleData, idx: number) => (
              <TableRow
                key={item._id || idx}
                className={item.status === "結束" ? "opacity-30" : ""}
              >
                <TableCell className="font-medium text-center">
                  {item.course_stage}
                </TableCell>
                <TableCell className="text-center">
                  {item.status === "結束" || item.status === "關閉" ? (
                    <Badge variant="outline">{item.status}</Badge>
                  ) : (
                    <Badge>{item.status}</Badge>
                  )}
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
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function formatDate(dateStr: string) {
  // If this is an invalid date, return the original date
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;

  return date.toLocaleString("zh-TW", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
