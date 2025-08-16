"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCaption,
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

export default function CourseScheduleList() {
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    axios.get("/api/course-schedule").then((res) => {
      setSchedules(res.data);
    });
  }, []);

  return (
    <>
      <Card className="w-full max-w-5xl">
        <CardHeader>
          <CardTitle>選課時程</CardTitle>
          <CardDescription>來看看選課時程表吧</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>選課時程一覽</TableCaption>
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
              {schedules.map((item: any, idx: number) => (
                <TableRow
                  key={item._id || idx}
                  className={item.status === "結束" ? "opacity-30" : ""}
                >
                  <TableCell className="font-medium">
                    {item.course_stage}
                  </TableCell>
                  <TableCell>
                    <Badge>{item.status}</Badge>
                  </TableCell>
                  <TableCell>{formatDate(item.start_time)}</TableCell>
                  <TableCell>{formatDate(item.end_time)}</TableCell>
                  <TableCell>{formatDate(item.result_publish_time)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
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
