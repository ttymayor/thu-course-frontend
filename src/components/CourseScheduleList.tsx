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
  CardDescription,
  CardHeader,
  CardTitle,
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
      <CardHeader>
        <CardTitle>選課時程</CardTitle>
        <CardDescription>來看看選課時程表吧</CardDescription>
      </CardHeader>
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
                  <Badge>{item.status}</Badge>
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
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const yyyy = d.getFullYear();
  const MM = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const HH = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${yyyy}/${MM}/${dd} ${HH}:${mm}`;
}
