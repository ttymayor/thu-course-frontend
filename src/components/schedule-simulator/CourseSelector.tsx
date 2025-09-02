"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Filter from "@/components/course-info/Filter";
import SelectableCourseList from "./SelectableCourseList";
import Pagination from "@/components/course-info/Pagination";
import ListSkeleton from "@/components/course-info/ListSkeleton";
import { CourseInfoData } from "@/components/course-info/types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  checkScheduleConflict,
  formatConflictMessage,
} from "@/lib/scheduleConflictChecker";
import { toast } from "sonner";

interface CourseSelectorProps {
  onSelectionChange: (selectedCourses: CourseInfoData[]) => void;
  onCourseHover: (hoveredCourse: CourseInfoData | null) => void;
  selectedCourses?: CourseInfoData[];
  skipInitialLoad?: boolean;
}

function CourseSelectorContent({
  onSelectionChange,
  onCourseHover,
  selectedCourses: externalSelectedCourses,
  skipInitialLoad,
}: CourseSelectorProps) {
  const searchParams = useSearchParams();
  const [courses, setCourses] = useState<CourseInfoData[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCourses, setSelectedCourses] = useState<CourseInfoData[]>([]);

  useEffect(() => {
    if (externalSelectedCourses) {
      // 如果有外部傳入的選中課程，優先使用外部狀態
      setSelectedCourses(externalSelectedCourses);
    } else {
      // 否則等待從 localStorage 重建（在另一個 useEffect 中處理）
      setSelectedCourses([]);
    }
  }, [externalSelectedCourses]);

  // 同步外部狀態變化
  useEffect(() => {
    if (externalSelectedCourses) {
      setSelectedCourses(externalSelectedCourses);
    }
  }, [externalSelectedCourses]);

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);

      // 構建查詢參數，參考 course-info 的實作方式
      const params: Record<string, string | number> = {
        page: parseInt(searchParams.get("page") || "1"),
        page_size: 10,
      };

      const search = searchParams.get("search");
      const department = searchParams.get("department");

      // 如果選擇了特定系所，直接使用系所篩選
      if (department) {
        params.department_code = department;
        // 在特定系所內搜尋時，只搜尋課程代碼和課程名稱
        if (search) {
          params.course_code = search;
          params.course_name = search;
        }
      } else {
        // 沒有選擇系所時，使用統一搜尋（包含系所代碼）
        if (search) {
          params.course_code = search;
          params.course_name = search;
          params.department_code = search;
        }
      }

      try {
        const queryString = new URLSearchParams(
          Object.entries(params).map(([key, value]) => [key, String(value)])
        ).toString();

        const response = await fetch(`/api/course-info?${queryString}`);
        const result = await response.json();
        if (result.success) {
          setCourses(result.data);
          setTotal(result.total);
        } else {
          setCourses([]);
          setTotal(0);
        }
      } catch (error) {
        console.error("Failed to fetch courses:", error);
        setCourses([]);
        setTotal(0);
      }
      setIsLoading(false);
    };

    fetchCourses();
  }, [searchParams]);

  // 從 localStorage 重建選中課程列表（只在沒有跳過初始載入時執行）
  useEffect(() => {
    const loadSelectedCourses = () => {
      if (!externalSelectedCourses && !skipInitialLoad) {
        const savedCourses = localStorage.getItem("selectedCourses");
        if (savedCourses) {
          try {
            const parsedCourses = JSON.parse(savedCourses);
            if (parsedCourses.length > 0) {
              setSelectedCourses(parsedCourses);
              onSelectionChange(parsedCourses);
            }
          } catch (error) {
            console.error("Failed to load selected courses:", error);
            // 如果解析失敗，嘗試從舊格式遷移
            const savedCourseCodes = localStorage.getItem(
              "selectedCourseCodes"
            );
            if (savedCourseCodes) {
              try {
                const parsedCourseCodes = JSON.parse(savedCourseCodes);
                if (parsedCourseCodes.length > 0 && courses.length > 0) {
                  const reconstructedCourses = courses.filter((course) =>
                    parsedCourseCodes.includes(course.course_code)
                  );
                  if (reconstructedCourses.length > 0) {
                    setSelectedCourses(reconstructedCourses);
                    onSelectionChange(reconstructedCourses);
                    // 遷移到新格式
                    localStorage.setItem(
                      "selectedCourses",
                      JSON.stringify(reconstructedCourses)
                    );
                    localStorage.removeItem("selectedCourseCodes");
                  }
                }
              } catch (migrationError) {
                console.error(
                  "Failed to migrate from old format:",
                  migrationError
                );
              }
            }
          }
        }
      }
    };

    loadSelectedCourses();
  }, [externalSelectedCourses, onSelectionChange, courses, skipInitialLoad]);

  const handleSelectionChange = (
    course: CourseInfoData,
    isSelected: boolean
  ) => {
    if (isSelected) {
      // 檢查是否有時間衝突
      const conflictInfo = checkScheduleConflict(selectedCourses, course);

      if (conflictInfo.hasConflict) {
        // 顯示衝突警告
        const conflictMessage = formatConflictMessage(conflictInfo);
        toast.warning("課程時間衝突", {
          description: `無法新增「${course.course_name}」：${conflictMessage}`,
          duration: 5000,
        });
        return; // 阻止新增有衝突的課程
      }

      // 沒有衝突，顯示成功訊息
      toast.success("已新增課程", {
        description: `已將「${course.course_name}」新增到您的課表中。`,
        duration: 3000,
      });
    }

    const newSelectedCourses = isSelected
      ? [...selectedCourses, course]
      : selectedCourses.filter((c) => c.course_code !== course.course_code);

    setSelectedCourses(newSelectedCourses);

    // 儲存完整的課程物件到 localStorage
    localStorage.setItem("selectedCourses", JSON.stringify(newSelectedCourses));

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
          <ListSkeleton />
        ) : (
          <SelectableCourseList
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
        <Suspense fallback={<ListSkeleton />}>
          <CourseSelectorContent {...props} />
        </Suspense>
      </CardContent>
    </Card>
  );
}
