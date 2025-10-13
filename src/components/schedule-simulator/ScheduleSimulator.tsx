"use client";

import { Suspense, useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { CourseData } from "@/components/course-info/types";
import ScheduleTable from "@/components/schedule-simulator/ScheduleTable";
import CourseSelector from "@/components/schedule-simulator/CourseSelector";
import { toast } from "sonner";
import Frame from "@/components/schedule-simulator/Frame";
import CourseListSkeleton from "@/components/schedule-simulator/CourseListSkeleton";
import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ScheduleSimulator() {
  const searchParams = useSearchParams();
  const [selectedCourses, setSelectedCourses] = useState<CourseData[]>([]);
  const [hoveredCourse, setHoveredCourse] = useState<CourseData | null>(null);

  // 從 Local Storage 載入已選課程
  useEffect(() => {
    const storedCodes = localStorage.getItem("selectedCourseCodes");
    if (storedCodes) {
      const codes = storedCodes.split(",").filter((code) => code);
      if (codes.length > 0) {
        // 從 API 載入課程資料
        fetch(
          `/api/course-info?${codes
            .map((code) => `course_codes=${encodeURIComponent(code)}`)
            .join("&")}&page_size=100`
        )
          .then((res) => res.json())
          .then((result) => {
            if (result.success && result.data) {
              setSelectedCourses(result.data);
            }
          });
      }
    }
  }, []);

  // 從 URL 參數獲取課程代碼
  const codesParam = searchParams.get("codes");

  // 使用 SWR 來載入分享的課程
  const { data: sharedCourses, isLoading: isLoadingShared } = useSWR(
    codesParam
      ? `/api/course-info?${codesParam
          .split(",")
          .map((code) => `course_codes=${encodeURIComponent(code.trim())}`)
          .join("&")}&page_size=100`
      : null,
    async (url: string) => {
      const response = await fetch(url);
      const result = await response.json();

      if (!result.success || !result.data || result.data.length === 0) {
        throw new Error("無法載入課程資料");
      }

      return result.data as CourseData[];
    }
  );

  // 決定要顯示的課程：如果有分享參數就顯示分享的課程，否則顯示本地保存的課程
  const displayCourses = useMemo(() => {
    return codesParam && sharedCourses ? sharedCourses : selectedCourses;
  }, [codesParam, sharedCourses, selectedCourses]);

  const isViewingShared = !!(codesParam && sharedCourses);

  // 當選擇的課程改變時，同步更新 Local Storage
  useEffect(() => {
    if (!isViewingShared && selectedCourses.length >= 0) {
      const courseCodes = selectedCourses.map((c) => c.course_code);
      localStorage.setItem("selectedCourseCodes", courseCodes.join(","));
    }
  }, [selectedCourses, isViewingShared]);

  const handleSelectionChange = (courses: CourseData[]) => {
    setSelectedCourses(courses);
  };

  const handleRemoveCourse = (courseCode: string) => {
    const courseToRemove = selectedCourses.find(
      (c) => c.course_code === courseCode
    );
    if (courseToRemove) {
      const newSelectedCourses = selectedCourses.filter(
        (c) => c.course_code !== courseCode
      );
      setSelectedCourses(newSelectedCourses);

      toast.info("已移除課程", {
        description: `已將 ${courseToRemove.course_name} 從您的課表中移除。`,
        action: {
          label: "復原",
          onClick: () => {
            setSelectedCourses([...newSelectedCourses, courseToRemove]);
          },
        },
      });
    }
  };

  const handleCourseHover = (hoveredCourse: CourseData | null) => {
    setHoveredCourse(hoveredCourse);
  };

  const handleImportShared = () => {
    if (sharedCourses) {
      setSelectedCourses(sharedCourses);
      toast.success("成功匯入課表！", {
        description: `已匯入 ${sharedCourses.length} 門課程到您的課表中。`,
      });

      // 清除 URL 參數
      window.history.replaceState({}, "", "/schedule-simulator");
    }
  };

  const handleRejectShared = () => {
    toast.info("已取消匯入");
    // 清除 URL 參數，回到正常模式
    window.history.replaceState({}, "", "/schedule-simulator");
  };

  return (
    <Frame>
      {/* 左側：課程選擇，寬度較窄 */}
      <div className="md:w-1/3 w-full md:pr-4 min-w-0">
        {isViewingShared ? (
          // 查看分享課表時，隱藏課程選擇器
          <Card>
            <CardHeader>
              <CardTitle className="text-center">
                查看分享課表時無法選擇課程
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-center">匯入到您的課表後即可編輯</p>
            </CardContent>
          </Card>
        ) : (
          <Suspense fallback={<CourseListSkeleton />}>
            <CourseSelector
              selectedCourses={selectedCourses}
              setSelectedCourses={setSelectedCourses}
              onSelectionChange={handleSelectionChange}
              onCourseHover={handleCourseHover}
            />
          </Suspense>
        )}
      </div>

      {/* 右側：課表模擬，寬度較寬 */}
      <div className="md:w-2/3 w-full min-w-0">
        {isLoadingShared ? (
          <ScheduleTable selectedCourses={[]} />
        ) : (
          <ScheduleTable
            selectedCourses={displayCourses}
            hoveredCourse={hoveredCourse}
            onRemoveCourse={isViewingShared ? undefined : handleRemoveCourse}
            isViewingShared={isViewingShared}
            onImportShared={handleImportShared}
            onRejectShared={handleRejectShared}
          />
        )}
      </div>
    </Frame>
  );
}
