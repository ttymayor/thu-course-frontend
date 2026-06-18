"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Trophy,
  BarChart3,
  Bookmark,
  Globe,
  FileText,
  Clock,
  Users,
  GraduationCap,
  Info,
  ChartSpline,
  ChartPie,
  Crosshair,
  TextCursor,
} from "lucide-react";
import { Course } from "@/types/course";
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
import useBookmark from "@/hooks/useBookmark";
import Link from "next/link";

function InfoBox({
  icon,
  label,
  value,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      <div>{icon}</div>
      <div className="flex flex-col gap-1">
        <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
          {label}
        </p>
        <div className="text-sm font-semibold">{value || children || "-"}</div>
      </div>
    </div>
  );
}

export default function DetailView({ courseInfo }: { courseInfo: Course }) {
  const { addBookmark, isBookmarked, removeBookmark } = useBookmark({
    academic_year: courseInfo.academic_year,
    academic_semester: courseInfo.academic_semester,
  });

  return (
    <>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col items-start gap-2 lg:flex-row">
            <Badge
              variant="outline"
              className="border-foreground/10 text-foreground/75 self-start font-mono lg:self-center"
            >
              {courseInfo.course_code}
            </Badge>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              {courseInfo.course_name || "-"}
            </h1>
          </div>
          <div className="text-muted-foreground text-sm">
            {courseInfo.teachers.map((teacher, index) => (
              <span key={`${teacher}-${index}`}>
                {index !== 0 && "、"}
                <Link
                  href={`/?search=${teacher}`}
                  prefetch={false}
                  className="hover:text-primary underline-offset-4 transition-colors hover:underline"
                >
                  {teacher}
                </Link>
              </span>
            ))}{" "}
            <span className="text-xs">教授</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link
              href={`https://course.thu.edu.tw/view/${courseInfo.academic_year}/${courseInfo.academic_semester}/${courseInfo.course_code}`}
              target="_blank"
              prefetch={false}
            >
              <Globe /> 課程資訊
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link
              href={`http://desc.ithu.tw/${courseInfo.academic_year}/${courseInfo.academic_semester}/${courseInfo.course_code}`}
              target="_blank"
              prefetch={false}
            >
              <FileText /> 授課大綱
            </Link>
          </Button>
          <Button
            variant="outline"
            size={"icon-sm"}
            onClick={() =>
              isBookmarked(courseInfo)
                ? removeBookmark(courseInfo)
                : addBookmark(courseInfo)
            }
          >
            <Bookmark
              fill={isBookmarked(courseInfo) ? "currentColor" : "none"}
            />
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {/* 基本資訊 */}
        <Card className="border-foreground/10 shadow-none">
          <CardContent>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <InfoBox
                icon={<Clock className="text-primary" />}
                label="上課時間"
              >
                {courseTimeParser(courseInfo.basic_info.class_time || "").map(
                  (entry, index) => (
                    <div
                      key={`${entry.day}-${entry.periods.join("-")}-${entry.location ?? ""}-${index}`}
                    >
                      {entry.day} {entry.periods.join(", ")}
                      {entry.location && `［${entry.location}］`}
                    </div>
                  ),
                )}
              </InfoBox>
              <InfoBox
                icon={<Users className="text-primary" />}
                label="修課對象"
                value={courseInfo.basic_info.target_class}
              />
              <InfoBox
                icon={<GraduationCap className="text-primary" />}
                label="修課年級"
                value={courseInfo.basic_info.target_grade}
              />
              <InfoBox
                icon={<Info className="text-primary" />}
                label="選課說明"
                value={courseInfo.basic_info.enrollment_notes}
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* 評分項目 */}
          <Card className="border-foreground/10 h-fit w-full">
            <Tabs defaultValue="chart">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                    <ChartPie className="text-primary" />
                    評分項目
                  </CardTitle>
                  <TabsList>
                    <TabsTrigger value="chart" className="cursor-pointer">
                      圖表
                    </TabsTrigger>
                    <TabsTrigger value="table" className="cursor-pointer">
                      表格
                    </TabsTrigger>
                  </TabsList>
                </div>
              </CardHeader>
              <CardContent>
                <TabsContent value="chart">
                  {courseInfo.grading_items &&
                  courseInfo.grading_items.length > 0 ? (
                    <GradingPieChart gradingItems={courseInfo.grading_items} />
                  ) : (
                    <div className="text-muted-foreground flex flex-col items-center justify-center py-10">
                      <Trophy className="mb-3 h-12 w-12 opacity-50" />
                      <p className="text-sm italic">暫無評分項目資訊</p>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="table">
                  {courseInfo.grading_items &&
                  courseInfo.grading_items.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-1/3">評分方式</TableHead>
                          <TableHead className="w-1/3 text-center">
                            比例
                          </TableHead>
                          <TableHead className="w-1/3">說明</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {courseInfo.grading_items.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.method}</TableCell>
                            <TableCell className="text-center">
                              <Badge variant="outline">
                                {item.percentage}%
                              </Badge>
                            </TableCell>
                            <TableCell>{item.description || "-"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-muted-foreground flex flex-col items-center justify-center py-10">
                      <Trophy className="mb-3 h-12 w-12 opacity-50" />
                      <p className="text-sm italic">暫無評分項目資訊</p>
                    </div>
                  )}
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>

          {/* 選課紀錄 */}
          <Card className="border-foreground/10 h-fit w-full">
            <Tabs defaultValue="chart">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                    <ChartSpline className="text-primary" />
                    選課紀錄趨勢
                  </CardTitle>
                  <TabsList>
                    <TabsTrigger value="chart" className="cursor-pointer">
                      圖表
                    </TabsTrigger>
                    <TabsTrigger value="table" className="cursor-pointer">
                      表格
                    </TabsTrigger>
                  </TabsList>
                </div>
              </CardHeader>
              <CardContent>
                <TabsContent value="chart">
                  {courseInfo.selection_records &&
                  courseInfo.selection_records.length > 0 ? (
                    <SelectionLineChart
                      selectionRecords={courseInfo.selection_records}
                    />
                  ) : (
                    <div className="text-muted-foreground flex flex-col items-center justify-center py-10">
                      <BarChart3 className="mb-3 h-12 w-12 opacity-50" />
                      <p className="text-sm italic">暫無選課紀錄資訊</p>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="table">
                  {courseInfo.selection_records &&
                  courseInfo.selection_records.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-1/3 text-center">
                            日期
                          </TableHead>
                          <TableHead className="w-1/3 text-center">
                            已選課 / 上課人數
                          </TableHead>
                          <TableHead className="w-1/3 text-center">
                            登記人數
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {courseInfo.selection_records.map((record, index) => (
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
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-muted-foreground flex flex-col items-center justify-center py-10">
                      <BarChart3 className="mb-3 h-12 w-12 opacity-50" />
                      <p className="text-sm italic">暫無選課紀錄資訊</p>
                    </div>
                  )}
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* 教學目標 */}
          <Card className="border-foreground/10 flex h-fit flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Crosshair className="text-primary" /> 教學目標
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              {courseInfo.teaching_goal ? (
                <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
                  {courseInfo.teaching_goal}
                </p>
              ) : (
                <div className="text-muted-foreground flex h-full items-center justify-center py-10 text-sm italic">
                  暫無教學目標資訊
                </div>
              )}
            </CardContent>
          </Card>

          {/* 課程描述 */}
          <Card className="border-foreground/10 flex h-fit flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TextCursor className="text-primary" /> 課程描述
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              {courseInfo.course_description ? (
                <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
                  {courseInfo.course_description}
                </p>
              ) : (
                <div className="text-muted-foreground flex h-full items-center justify-center py-10 text-sm italic">
                  暫無課程描述資訊
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
