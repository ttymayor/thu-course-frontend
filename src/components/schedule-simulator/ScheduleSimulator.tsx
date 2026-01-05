"use client";

import { Suspense, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Course } from "@/types/course";
import ScheduleCard from "@/components/schedule-simulator/ScheduleCard";
import CourseSelector from "@/components/schedule-simulator/CourseSelector";
import { toast } from "sonner";
import Frame from "@/components/schedule-simulator/Frame";
import CourseListSkeleton from "@/components/schedule-simulator/CourseListSkeleton";
import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useSelectedCourses from "@/hooks/useSelectedCourses";

export default function ScheduleSimulator() {
  const searchParams = useSearchParams();
  const { selectedCourses, setSelectedCourses, removeCourse, importCourses } =
    useSelectedCourses();
  const [hoveredCourse, setHoveredCourse] = useState<Course | null>(null);

  // 從 URL 參數獲取課程代碼
  const codesParam = searchParams.get("codes");

  // 處理並驗證課程代碼參數
  const validCodes = useMemo(() => {
    if (!codesParam || !codesParam.trim()) {
      return [];
    }
    return codesParam
      .split(",")
      .map((code) => code.trim())
      .filter((code) => code);
  }, [codesParam]);

  // 使用 SWR 來載入分享的課程
  const { data: sharedCourses, isLoading: isLoadingShared } = useSWR(
    validCodes.length > 0
      ? `/api/course-info?${validCodes
          .map((code) => `course_codes=${encodeURIComponent(code)}`)
          .join("&")}&page_size=100`
      : null,
    async (url: string) => {
      const response = await fetch(url);
      const result = await response.json();

      if (!result.success || !result.data || result.data.length === 0) {
        throw new Error("無法載入課程資料");
      }

      return result.data as Course[];
    },
  );

  // 決定要顯示的課程：如果有分享參數就顯示分享的課程，否則顯示本地保存的課程
  const displayCourses = useMemo(() => {
    return validCodes.length > 0 && sharedCourses
      ? sharedCourses
      : selectedCourses;
  }, [validCodes.length, sharedCourses, selectedCourses]);

  const isViewingShared = !!(validCodes.length > 0 && sharedCourses);

  const handleCourseHover = (hoveredCourse: Course | null) => {
    setHoveredCourse(hoveredCourse);
  };

  const handleImportShared = () => {
    if (sharedCourses) {
      importCourses(sharedCourses);
      window.history.replaceState({}, "", "/schedule-simulator");
    }
  };

  const handleRejectShared = () => {
    toast.info("已取消匯入");
    window.history.replaceState({}, "", "/schedule-simulator");
  };

  return (
    <Frame>
      <div className="w-full min-w-0 md:w-1/3 md:pr-4">
        {isViewingShared ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-center">
                查看分享課表時無法選擇課程
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-sm">匯入到您的課表後即可編輯</p>
            </CardContent>
          </Card>
        ) : (
          <Suspense fallback={<CourseListSkeleton />}>
            <CourseSelector
              selectedCourses={selectedCourses}
              setSelectedCourses={setSelectedCourses}
              onCourseHover={handleCourseHover}
            />
          </Suspense>
        )}
      </div>

      <div className="w-full min-w-0 md:w-2/3">
        {isLoadingShared ? (
          <ScheduleCard selectedCourses={[]} />
        ) : (
          <ScheduleCard
            selectedCourses={displayCourses}
            hoveredCourse={hoveredCourse}
            onRemoveCourse={isViewingShared ? undefined : removeCourse}
            isViewingShared={isViewingShared}
            onImportShared={handleImportShared}
            onRejectShared={handleRejectShared}
          />
        )}
      </div>
    </Frame>
  );
}
