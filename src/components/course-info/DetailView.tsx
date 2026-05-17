"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Target,
  BookOpen,
  Trophy,
  BarChart3,
  Bookmark,
  Globe,
  FileText,
  User,
  Clock,
  Users,
  GraduationCap,
  Info,
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
import { Separator } from "@/components/ui/separator";
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
    <div className="flex gap-3">
      <div className="mt-1">{icon}</div>
      <div>
        <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
          {label}
        </p>
        <div className="mt-1 text-sm font-semibold">
          {value || children || "-"}
        </div>
      </div>
    </div>
  );
}

export default function DetailView({ courseInfo }: { courseInfo: Course }) {
  const { addBookmark, isBookmarked, removeBookmark } = useBookmark();

  return (
    <>
      <div className="flex flex-col gap-6 border-b pb-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="px-2 py-1 font-mono text-lg">
              {courseInfo.course_code}
            </Badge>
            <h1 className="text-3xl font-extrabold tracking-tight">
              {courseInfo.course_name || "-"}
            </h1>
          </div>
          <div className="flex flex-wrap gap-2">
            {courseInfo.teachers.map((teacher, index) => (
              <Badge key={index} variant="secondary" className="rounded-full">
                <User className="h-3 w-3" /> {teacher}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link
              href={`https://course.thu.edu.tw/view/${courseInfo.academic_year}/${courseInfo.academic_semester}/${courseInfo.course_code}`}
              target="_blank"
              prefetch={false}
            >
              <Globe className="mr-2 h-4 w-4" /> 課程資訊
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link
              href={`http://desc.ithu.tw/${courseInfo.academic_year}/${courseInfo.academic_semester}/${courseInfo.course_code}`}
              target="_blank"
              prefetch={false}
            >
              <FileText className="mr-2 h-4 w-4" /> 授課大綱
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
              className="h-5 w-5"
              fill={isBookmarked(courseInfo) ? "currentColor" : "none"}
            />
          </Button>
        </div>
      </div>

      {/* 基本資訊 */}
      <Card className="bg-secondary/10 border-none shadow-none">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <InfoBox icon={<Clock className="text-primary" />} label="上課時間">
              {courseTimeParser(courseInfo.basic_info.class_time || "").map(
                (entry) => (
                  <div key={entry.day}>
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

      <Separator className="my-2" />
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* 評分項目 */}
        <Card className="bg-background/50 w-full backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                評分項目
              </CardTitle>
              <Tabs defaultValue="chart">
                <TabsList>
                  <TabsTrigger value="chart" className="cursor-pointer">
                    圖表
                  </TabsTrigger>
                  <TabsTrigger value="table" className="cursor-pointer">
                    表格
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="chart">
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
                            <Badge variant="outline">{item.percentage}%</Badge>
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
            </Tabs>
          </CardContent>
        </Card>

        {/* 選課紀錄 */}
        <Card className="bg-background/50 w-full backdrop-blur-sm">
          <Tabs defaultValue="chart">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
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

      <Separator className="my-2" />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* 教學目標 */}
        <Card className="bg-background/50 flex flex-col backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="text-primary h-5 w-5" /> 教學目標
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
        <Card className="bg-background/50 flex flex-col backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="text-primary h-5 w-5" /> 課程描述
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
    </>
  );
}
