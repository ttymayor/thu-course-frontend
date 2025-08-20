"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CalendarDays,
  Target,
  BookOpen,
  Trophy,
  BarChart3,
} from "lucide-react";
import { CourseDetail } from "@/lib/courseDetail";
import GradingPieChart from "@/components/GradingPieChart";
import SelectionLineChart from "@/components/SelectionLineChart";

export default function CourseDetailPage() {
  const params = useParams();
  const courseCode = params.courseCode as string;
  const [courseDetail, setCourseDetail] = useState<CourseDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseCode) return;

    setIsLoading(true);
    setError(null);
    axios
      .get(`/api/course-detail/${courseCode}`)
      .then((res) => {
        if (res.data.success) {
          setCourseDetail(res.data.data);
        } else {
          setError(res.data.error || "課程資料載入失敗");
        }
      })
      .catch((error) => {
        console.error("Failed to load course detail:", error);
        if (error.response?.status === 404) {
          setError("找不到此課程");
        } else {
          setError("載入課程資料時發生錯誤");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [courseCode]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 max-w-7xl">
        {/* 標題區域 skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-6 w-16" />
        </div>

        {/* 三欄卡片區域 skeleton */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* 基本資訊 skeleton */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-6 w-20" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>

          {/* 評分項目 skeleton */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-6 w-20" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <Skeleton className="h-40 w-40 rounded-full" />
              </div>
            </CardContent>
          </Card>

          {/* 選課紀錄 skeleton */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-6 w-24" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-40 w-full" />
            </CardContent>
          </Card>
        </div>

        {/* 教學目標 skeleton */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-6 w-20" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </CardContent>
        </Card>

        {/* 課程描述 skeleton */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-6 w-20" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 max-w-7xl">
        <Card>
          <CardContent className="text-center py-8">
            <div className="text-red-500 text-lg font-medium">{error}</div>
            <p className="text-gray-500 mt-2">請檢查課程代碼是否正確</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!courseDetail) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 max-w-7xl">
      <div className="flex items-center gap-2">
        <code className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-lg font-semibold">
          {courseDetail.course_code}
        </code>
        <h1 className="text-3xl font-bold">
          {courseDetail.course_name ? `${courseDetail.course_name} ` : "-"}
        </h1>
        <div className="h-1 w-10 bg-muted" />
        {courseDetail.teachers.map((teacher, index) => (
          <Badge key={index} variant="secondary" className="text-sm">
            {teacher}
          </Badge>
        ))}
        <div className="flex-1" />
        <a
          href={`https://teacher.thu.edu.tw/102/teac2_desc/outline6/print_outline.php?setyear=114&setterm=1&curr_code=${courseDetail.course_code}&ss_sysid=otr`}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto underline font-medium"
        >
          授課大綱
        </a>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
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
              <li>上課時間：{courseDetail.basic_info.class_time}</li>
              <li>修課對象：{courseDetail.basic_info.target_class}</li>
              <li>修課年級：{courseDetail.basic_info.target_grade}</li>
              <li>選課說明：{courseDetail.basic_info.enrollment_notes}</li>
            </ul>
          </CardContent>
        </Card>

        {/* 評分項目 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              評分項目
            </CardTitle>
          </CardHeader>
          <CardContent>
            <GradingPieChart gradingItems={courseDetail.grading_items} />
          </CardContent>
        </Card>

        {/* 選課紀錄 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              選課紀錄趨勢
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SelectionLineChart
              selectionRecords={courseDetail.selection_records}
            />
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
          <p className="whitespace-pre-line leading-relaxed">
            {courseDetail.teaching_goal}
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
          <p className="whitespace-pre-line leading-relaxed">
            {courseDetail.course_description}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
