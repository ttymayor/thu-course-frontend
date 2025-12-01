"use client";

import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { courseTimeParser } from "@/lib/courseTimeParser";
import { CourseData, CourseTypeMap } from "./types";
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import LoadingIndicator from "@/components/LoadingIndicator";
import useBookmark from "@/hooks/useBookmark";

interface ListProps {
  infos: CourseData[];
}

export default function List({ infos }: ListProps) {
  const { addBookmark, isBookmarked, removeBookmark } = useBookmark();
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
            <TableHead className="text-center">系所名稱 / 上課年級</TableHead>
            <TableHead className="text-center">書籤</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {infos.map((item: CourseData, idx: number) => (
            <TableRow
              key={idx}
              className={`h-12 ${
                item.is_closed ? "line-through opacity-30" : ""
              }`}
            >
              <TableCell className="text-center">
                <code className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                  {item.course_code}
                </code>
              </TableCell>
              <TableCell className="text-center">
                {item.is_closed ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>{item.course_name}</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <span>已停開...</span>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <Link
                    prefetch={false}
                    href={`/course-info/${item.course_code}`}
                    className="inline-flex items-center gap-2 underline"
                  >
                    {item.course_name} <LoadingIndicator />
                  </Link>
                )}
              </TableCell>
              <TableCell className="text-center">
                <Badge variant={"secondary"} className="text-xs">
                  {courseTypeMap[item.course_type] || item.course_type}{" "}
                  {item.credits_1}-{item.credits_2}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                {item.teachers?.length
                  ? `${item.teachers.slice(0, 3).join("、")}`
                  : "-"}
                {item.teachers?.length > 3 && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="cursor-pointer">...</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      {item.teachers.slice(3).join("、")}
                    </TooltipContent>
                  </Tooltip>
                )}
              </TableCell>
              <TableCell className="text-center">
                {(item.class_time && (
                  <div className="inline-block text-left">
                    {courseTimeParser(item.class_time).map((entry, index) => (
                      <div key={index}>
                        {entry.day} {entry.periods.join(", ")}
                        {entry.location && `［${entry.location}］`}
                      </div>
                    ))}
                  </div>
                )) ||
                  "-"}
              </TableCell>
              <TableCell className="text-center">
                {item.department_name} / {item.target_class || "-"}
              </TableCell>
              <TableCell className="text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="cursor-pointer"
                  onClick={
                    isBookmarked(item)
                      ? () => removeBookmark(item)
                      : () => addBookmark(item)
                  }
                  disabled={item.is_closed}
                >
                  {isBookmarked(item) ? (
                    <Bookmark fill="currentColor" className="h-4 w-4" />
                  ) : (
                    <Bookmark className="h-4 w-4" />
                  )}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
