import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { courseTimeParser } from "@/lib/courseTimeParser";
import { CourseInfoData, CourseTypeMap } from "./types";

interface ListProps {
  infos: CourseInfoData[];
}

export default function List({ infos }: ListProps) {
  const courseTypeMap: CourseTypeMap = {
    1: "必修",
    2: "必選",
    3: "選修",
  };

  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full">
        <TableHeader>
          <TableRow className="h-12">
            <TableHead className="text-center">課程代碼</TableHead>
            <TableHead className="text-center">課程名稱</TableHead>
            <TableHead className="text-center">學分</TableHead>
            <TableHead className="text-center">教師</TableHead>
            <TableHead className="text-center">時間地點</TableHead>
            <TableHead className="text-center">
              系所名稱 / 上課年級
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {infos.map((item: CourseInfoData, idx: number) => (
            <TableRow key={idx} className="h-12">
              <TableCell className="text-center">
                {item.course_code}
              </TableCell>
              <TableCell className="text-center">
                <Link
                  href={`/course-detail/${item.course_code}`}
                  className="underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.course_name}
                </Link>
              </TableCell>
              <TableCell className="text-center">
                <Badge variant={"secondary"} className="text-xs">
                  {courseTypeMap[item.course_type] ||
                    item.course_type}{" "}
                  {item.credits_1}-{item.credits_2}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                {item.teachers ? item.teachers.join(", ") : "-"}
              </TableCell>
              <TableCell className="text-center">
                {item.class_time && (
                  <ul className="list-disc list-inside inline-block text-left">
                    {courseTimeParser(item.class_time).map(
                      (entry, index) => (
                        <li key={index}>
                          {entry.day} {entry.periods.join(", ")}{" "}
                          {entry.location && `［${entry.location}］`}
                        </li>
                      )
                    ) || "-"}
                  </ul>
                )}
              </TableCell>
              <TableCell className="text-center">
                {item.department_name} / {item.target_class || "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
