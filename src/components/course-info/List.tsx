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
import { CourseTypeMap } from "./types";
import { Button } from "@/components/ui/button";
import {
  Bookmark,
  Clock,
  ExternalLink,
  MapPin,
  School,
  Star,
  User,
} from "lucide-react";
import LoadingIndicator from "@/components/LoadingIndicator";
import useBookmark from "@/hooks/useBookmark";
import { Course } from "@/types/course";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ListProps {
  courses: Course[];
}

export default function List({ courses }: ListProps) {
  const { addBookmark, isBookmarked, removeBookmark } = useBookmark();
  const courseTypeMap: CourseTypeMap = {
    1: "必修",
    2: "必選",
    3: "選修",
  };

  return (
    <div className="overflow-x-auto">
      <Tabs defaultValue="card">
        <TabsList className="gap-1">
          <TabsTrigger value="list" className="cursor-pointer">
            列表
          </TabsTrigger>
          <TabsTrigger value="card" className="cursor-pointer">
            卡片
          </TabsTrigger>
        </TabsList>
        <TabsContent value="list">
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
                <TableHead className="text-center">書籤</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course, idx) => (
                <TableRow
                  key={idx}
                  className={`h-12 ${
                    course.is_closed ? "line-through opacity-30" : ""
                  }`}
                >
                  <TableCell className="text-center">
                    <code className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                      {course.course_code}
                    </code>
                  </TableCell>
                  <TableCell className="text-center">
                    {course.is_closed ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span>{course.course_name}</span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <span>已停開...</span>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <Link
                        prefetch={false}
                        href={`/course-info/${course.course_code}`}
                        className="no-underline hover:underline"
                      >
                        {course.course_name} <LoadingIndicator />
                      </Link>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={"secondary"} className="text-xs">
                      {courseTypeMap[course.course_type] || course.course_type}{" "}
                      {course.credits_1}-{course.credits_2}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {course.teachers?.length
                      ? `${course.teachers.slice(0, 3).join("、")}`
                      : "-"}
                    {course.teachers?.length > 3 && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="cursor-pointer">...</span>
                        </TooltipTrigger>
                        <TooltipContent>
                          {course.teachers.slice(3).join("、")}
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {(course.basic_info?.class_time && (
                      <div className="inline-block text-left">
                        {courseTimeParser(course.basic_info.class_time).map(
                          (entry, index) => (
                            <div key={index}>
                              {entry.day} {entry.periods.join(", ")}
                              {entry.location && `［${entry.location}］`}
                            </div>
                          ),
                        )}
                      </div>
                    )) ||
                      "-"}
                  </TableCell>
                  <TableCell className="text-center">
                    {course.department_name} /{" "}
                    {course.basic_info?.target_class || "-"}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="cursor-pointer"
                      onClick={
                        isBookmarked(course)
                          ? () => removeBookmark(course)
                          : () => addBookmark(course)
                      }
                      disabled={course.is_closed}
                    >
                      {isBookmarked(course) ? (
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
        </TabsContent>
        <TabsContent value="card">
          <div className="grid gap-2 sm:grid-cols-2">
            {courses.map((course, idx) => (
              <Card
                className="bg-primary/5 hover:border-primary/40 group shadow-sm transition-all hover:shadow-lg"
                key={course._id || idx}
              >
                <CardHeader className="">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="text-muted-foreground border-secondary font-mono text-xs"
                      >
                        {course.course_code}
                      </Badge>
                      {course.is_closed && (
                        <Badge variant="destructive">已停開</Badge>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground h-8 w-8 transition-all"
                      onClick={() =>
                        isBookmarked(course)
                          ? removeBookmark(course)
                          : addBookmark(course)
                      }
                    >
                      <Bookmark
                        className="h-4 w-4"
                        fill={isBookmarked(course) ? "currentColor" : "none"}
                      />
                    </Button>
                  </div>
                  {/* 第二層：課程名稱 */}
                  <CardTitle className="text-lg leading-tight">
                    <Link
                      href={`/course-info/${course.course_code}`}
                      prefetch={false}
                      className="hover:text-primary underline-offset-4 transition-all hover:underline"
                    >
                      {course.course_name}
                    </Link>
                  </CardTitle>
                  {/* 第三層：課程簡介 */}
                  <CardDescription className="line-clamp-2 min-h-[2.5rem] text-xs leading-relaxed">
                    {course.course_description || "課程沒有留下任何說明..."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Star className="size-4" />
                      {courseTypeMap[course.course_type] ||
                        course.course_type}{" "}
                      {course.credits_1}-{course.credits_2}
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <User className="size-4" />
                      {course.teachers?.length
                        ? `${course.teachers.slice(0, 3).join("、")}`
                        : "-"}
                      {course.teachers?.length > 3 && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="cursor-pointer">...</span>
                          </TooltipTrigger>
                          <TooltipContent>
                            {course.teachers.slice(3).join("、")}
                          </TooltipContent>
                        </Tooltip>
                      )}

                      <Link
                        href={`https://www.dcard.tw/search?query=${encodeURIComponent(course.teachers.slice(0, 3).join("、"))}&forum=thu`}
                        className="flex"
                        target="_blank"
                        rel="noopener noreferrer"
                        prefetch={false}
                      >
                        <ExternalLink className="-ml-1 size-4" />
                      </Link>
                    </div>

                    <div className="flex items-start gap-2 text-sm">
                      <Clock className="mt-0.5 size-4" />
                      {(course.basic_info?.class_time && (
                        <div className="inline-block text-left">
                          {courseTimeParser(course.basic_info.class_time).map(
                            (entry, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2"
                              >
                                <span>
                                  {entry.day} {entry.periods.join(", ")}
                                </span>
                                {entry.location && (
                                  <span className="text-muted-foreground/70 bg-secondary/50 flex items-center rounded px-1.5 text-xs">
                                    <MapPin className="mr-1 inline size-3" />
                                    {entry.location}
                                  </span>
                                )}
                              </div>
                            ),
                          )}
                        </div>
                      )) ||
                        "-"}
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <School className="size-4" />
                      {course.department_name} /{" "}
                      {course.basic_info?.target_class || "-"}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
