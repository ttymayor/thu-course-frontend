"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import Filter from "@/components/course-info/Filter";
import CourseList from "./CourseList";
import Pagination from "@/components/course-info/Pagination";
import CourseListSkeleton from "./CourseListSkeleton";
import { CourseInfoData } from "@/components/course-info/types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  checkScheduleConflict,
  formatConflictMessage,
} from "@/lib/scheduleConflictChecker";
import { toast } from "sonner";

interface CourseSelectorProps {
  selectedCourses: CourseInfoData[];
  setSelectedCourses: (selectedCourses: CourseInfoData[]) => void;
  onSelectionChange: (selectedCourses: CourseInfoData[]) => void;
  onCourseHover: (hoveredCourse: CourseInfoData | null) => void;
}

function CourseSelectorContent({
  selectedCourses,
  setSelectedCourses,
  onSelectionChange,
  onCourseHover,
}: CourseSelectorProps) {
  const searchParams = useSearchParams();

  // 構建查詢參數和 SWR key
  const params: Record<string, string | number> = {
    page: parseInt(searchParams.get("page") || "1"),
    page_size: 10,
  };

  const search = searchParams.get("search");
  const department = searchParams.get("department");

  if (department) {
    params.department_code = department;
  }

  if (search) {
    params.course_name = search;
    params.course_code = search;
  }

  const queryString = new URLSearchParams(
    Object.entries(params).map(([key, value]) => [key, String(value)])
  ).toString();

  const swrKey = `/api/course-info?${queryString}`;

  // SWR fetcher 函數
  const fetcher = async (url: string) => {
    const response = await fetch(url);
    const result = await response.json();
    if (result.success) {
      return { data: result.data, total: result.total };
    } else {
      return { data: [], total: 0 };
    }
  };

  const { data, isLoading, error } = useSWR(swrKey, fetcher);

  const courses = data?.data || [];
  const total = data?.total || 0;

  const handleSelectionChange = (
    course: CourseInfoData,
    isSelected: boolean
  ) => {
    if (isSelected) {
      const conflictInfo = checkScheduleConflict(selectedCourses, course);

      if (conflictInfo.hasConflict) {
        const conflictMessage = formatConflictMessage(conflictInfo);
        toast.warning("課程時間衝突", {
          description: `無法新增「${course.course_name}」：${conflictMessage}`,
          duration: 5000,
        });
        return;
      }

      toast.success("已新增課程", {
        description: `已將「${course.course_name}」新增到您的課表中。`,
        duration: 3000,
      });
    }

    const newSelectedCourses = isSelected
      ? [...selectedCourses, course]
      : selectedCourses.filter((c) => c.course_code !== course.course_code);

    setSelectedCourses(newSelectedCourses);
    onSelectionChange(newSelectedCourses);
  };

  // hover handler
  const handleCourseHover = (course: CourseInfoData | null) => {
    onCourseHover(course);
  };

  return (
    <div className="flex flex-col h-full">
      <Filter />
      <div className="flex-grow">
        {isLoading ? (
          <CourseListSkeleton />
        ) : error ? (
          <div className="text-center text-red-500 py-4">
            載入課程資料時發生錯誤，請稍後再試。
          </div>
        ) : (
          <CourseList
            infos={courses}
            selectedCourseCodes={
              new Set(selectedCourses.map((c) => c.course_code))
            }
            selectedCourses={selectedCourses}
            onSelectionChange={handleSelectionChange}
            onCourseHover={handleCourseHover}
          />
        )}
      </div>
      <Pagination total={total} />
    </div>
  );
}

export default function CourseSelector(props: CourseSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>課程選擇</CardTitle>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<CourseListSkeleton />}>
          <CourseSelectorContent {...props} />
        </Suspense>
      </CardContent>
    </Card>
  );
}
