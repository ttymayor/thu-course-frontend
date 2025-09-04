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
  const [courses, setCourses] = useState<CourseInfoData[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

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
