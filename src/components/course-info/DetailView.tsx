"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  Target,
  BookOpen,
  Trophy,
  BarChart3,
  Bookmark,
} from "lucide-react";
import { CourseData } from "@/components/course-info/types";
import GradingPieChart from "@/components/course-info/GradingPieChart";
import SelectionLineChart from "@/components/course-info/SelectionLineChart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { courseTimeParser } from "@/lib/courseTimeParser";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import useBookmark from "@/hooks/useBookmark";
import Link from "next/link";

export default function DetailView({ courseInfo }: { courseInfo: CourseData }) {
  const { addBookmark, isBookmarked, removeBookmark } = useBookmark();

  return (
    <>
      <div className="flex flex-col items-baseline gap-x-4 gap-y-2 sm:flex-row">
        {/* 課程基本資訊 */}

        <div className="flex flex-wrap items-center gap-2">
          <code className="bg-muted relative w-fit rounded px-[0.3rem] py-[0.2rem] font-mono text-base font-semibold sm:text-lg">
            {courseInfo.course_code}
          </code>
          <h1 className="text-xl font-bold sm:text-3xl">
            {courseInfo.course_name ? `${courseInfo.course_name} ` : "-"}
          </h1>
          {courseInfo.teachers.map((teacher, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="text-xs sm:text-sm"
            >
              {teacher}
            </Badge>
          ))}
        </div>

        <Separator className="block sm:hidden" />

        <div className="flex items-center justify-between gap-4 text-sm sm:ml-auto sm:justify-end">
          <div className="flex flex-row gap-2">
            <Link
              href={`https://course.thu.edu.tw/view/114/1/${courseInfo.course_code}`}
              className="font-medium text-nowrap underline"
            >
              課程資訊網
            </Link>
            <Link
              href={`http://desc.ithu.tw/114/1/${courseInfo.course_code}`}
              className="font-medium text-nowrap underline"
            >
              授課大綱
            </Link>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer"
            onClick={() =>
              isBookmarked(courseInfo)
                ? removeBookmark(courseInfo)
                : addBookmark(courseInfo)
            }
          >
            {isBookmarked(courseInfo) ? (
              <Bookmark fill="currentColor" className="h-5 w-5" />
            ) : (
              <Bookmark className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* 基本資訊 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            基本資訊
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
            <li className="">
              上課時間：
              {courseTimeParser(courseInfo.class_time || "").map(
                (entry, index) => (
                  <span key={entry.day}>
                    {index > 0 && "、"}
                    {entry.day} {entry.periods.join(", ")}
                    {entry.location && `［${entry.location}］`}
                  </span>
                ),
              )}
            </li>
            <li>修課對象：{courseInfo.target_class || "-"}</li>
            <li>修課年級：{courseInfo.target_grade || "-"}</li>
            <li>選課說明：{courseInfo.enrollment_notes || "-"}</li>
          </ul>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* 評分項目 */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              評分項目
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="chart">
              <TabsList>
                <TabsTrigger value="chart" className="cursor-pointer">
                  圖表
                </TabsTrigger>
                <TabsTrigger value="table" className="cursor-pointer">
                  表格
                </TabsTrigger>
              </TabsList>
              <TabsContent value="chart">
                <GradingPieChart
                  gradingItems={courseInfo.grading_items || []}
                />
              </TabsContent>
              <TabsContent value="table">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/3">評分方式</TableHead>
                      <TableHead className="w-1/3 text-center">比例</TableHead>
                      <TableHead className="w-1/3">說明</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(courseInfo.grading_items || []).map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.method}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline">{item.percentage}%</Badge>
                        </TableCell>
                        <TableCell>{item.description || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* 選課紀錄 */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              選課紀錄趨勢
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="chart">
              <TabsList>
                <TabsTrigger value="chart" className="cursor-pointer">
                  圖表
                </TabsTrigger>
                <TabsTrigger value="table" className="cursor-pointer">
                  表格
                </TabsTrigger>
              </TabsList>
              <TabsContent value="chart">
                <SelectionLineChart
                  selectionRecords={courseInfo.selection_records || []}
                />
              </TabsContent>
              <TabsContent value="table">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/3 text-center">日期</TableHead>
                      <TableHead className="w-1/3 text-center">
                        已選課 / 上課人數
                      </TableHead>
                      <TableHead className="w-1/3 text-center">
                        登記人數
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(courseInfo.selection_records || []).map(
                      (record, index) => (
                        <TableRow key={index}>
                          <TableCell className="text-center">
                            {record.date || "-"}
                          </TableCell>
                          <TableCell className="text-center">
                            {record.enrolled} /{" "}
                            {record.remaining + record.enrolled}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant={"outline"}>
                              {record.registered}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ),
                    )}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* 教學目標 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            教學目標
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="leading-relaxed whitespace-pre-line">
            {courseInfo.teaching_goal || "-"}
          </p>
        </CardContent>
      </Card>

      {/* 課程描述 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            課程描述
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="leading-relaxed whitespace-pre-line">
            {courseInfo.course_description || "-"}
          </p>
        </CardContent>
      </Card>
    </>
  );
}
