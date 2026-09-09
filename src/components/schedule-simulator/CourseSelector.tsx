"use client";

import { Suspense, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import Filter from "@/components/course-info/Filter";
import CourseList from "./CourseList";
import Pagination from "@/components/course-info/Pagination";
import CourseListSkeleton from "./CourseListSkeleton";
import { Course } from "@/types/course";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CourseTerm, dedupeCourseTerms } from "@/lib/courseIdentity";

interface CourseSelectorProps {
  terms: CourseTerm[];
  selectedTerm: CourseTerm | null;
  selectedCourses: Course[];
  setSelectedCourses: (selectedCourses: Course[]) => void;
  onCourseHover: (hoveredCourse: Course | null) => void;
}

function CourseSelectorContent({
  selectedCourses,
  setSelectedCourses,
  onCourseHover,
  terms,
  selectedTerm,
}: CourseSelectorProps) {
  const [showSelectedCourses, setShowSelectedCourses] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const termOptions = dedupeCourseTerms(
    selectedTerm ? [selectedTerm, ...terms] : terms,
  );

  // 構建查詢參數和 SWR key
  const params: Record<string, string | number> = {
    page: parseInt(searchParams.get("page") || "1"),
    page_size: 10,
  };

  if (selectedTerm) {
    params.academic_year = selectedTerm.academic_year;
    params.academic_semester = selectedTerm.academic_semester;
  }

  const search = searchParams.get("search");
  const department = searchParams.get("department");

  if (department) {
    params.department_code = department;
  }

  if (search) {
    params.course_name = search;
    params.course_code = search;
    params.teacher = search;
  }

  const queryString = new URLSearchParams(
    Object.entries(params).map(([key, value]) => [key, String(value)]),
  ).toString();

  const swrKey = selectedTerm ? `/api/course-info?${queryString}` : null;

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

  const courses: Course[] = data?.data || [];
  const total: number = data?.total || 0;

  const handleSelectionChange = (course: Course, isSelected: boolean) => {
    const newSelectedCourses = isSelected
      ? [...selectedCourses, course]
      : selectedCourses.filter((c) => c.course_code !== course.course_code);
    setSelectedCourses(newSelectedCourses);
  };

  // hover handler
  const handleCourseHover = (course: Course | null) => {
    onCourseHover(course);
  };

  const handleTermChange = (value: string) => {
    const [academicYear, academicSemester] = value.split("-").map(Number);
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.delete("page");
    current.delete("codes");
    current.set("year", String(academicYear));
    current.set("semester", String(academicSemester));

    const search = current.toString();
    router.replace(`${pathname}${search ? `?${search}` : ""}`);
  };

  return (
    <div className="flex h-full flex-col gap-2">
      <Select
        value={
          selectedTerm
            ? `${selectedTerm.academic_year}-${selectedTerm.academic_semester}`
            : undefined
        }
        onValueChange={handleTermChange}
        disabled={termOptions.length === 0}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="選擇學期" />
        </SelectTrigger>
        <SelectContent className="p-1">
          {termOptions.map((term) => (
            <SelectItem
              key={`${term.academic_year}-${term.academic_semester}`}
              value={`${term.academic_year}-${term.academic_semester}`}
            >
              {term.academic_year} 學年度第 {term.academic_semester} 學期
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Filter />
      <Button
        variant={showSelectedCourses ? "outline" : "default"}
        className="cursor-pointer"
        onClick={() => setShowSelectedCourses(!showSelectedCourses)}
      >
        {showSelectedCourses ? "顯示所有課程" : "顯示已選課程"}
      </Button>
      <div className="grow overflow-hidden">
        {isLoading ? (
          <CourseListSkeleton />
        ) : error ? (
          <div className="text-destructive py-4 text-center">
            載入課程資料時發生錯誤，請稍後再試。
          </div>
        ) : (
          <div className="h-full scrollbar-thin overflow-auto">
            <CourseList
              courses={showSelectedCourses ? selectedCourses : courses}
              selectedCourseCodes={
                new Set(selectedCourses.map((course) => course.course_code))
              }
              selectedCourses={selectedCourses}
              onSelectionChange={handleSelectionChange}
              onCourseHover={handleCourseHover}
            />
          </div>
        )}
      </div>
      {!showSelectedCourses && <Pagination total={total} />}
    </div>
  );
}

export default function CourseSelector(props: CourseSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-bold">課程選擇</CardTitle>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<CourseListSkeleton />}>
          <CourseSelectorContent {...props} />
        </Suspense>
      </CardContent>
    </Card>
  );
}
