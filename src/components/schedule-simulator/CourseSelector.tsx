"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Filter from "@/components/course-info/Filter";
import SelectableCourseList from "./SelectableCourseList";
import Pagination from "@/components/course-info/Pagination";
import ListSkeleton from "@/components/course-info/ListSkeleton";
import { CourseInfoData } from "@/components/course-info/types";
import { Card, CardContent, CardHeader } from "../ui/card";

interface CourseSelectorProps {
  onSelectionChange: (selectedCourses: CourseInfoData[]) => void;
  onCourseHover: (hoveredCourse: CourseInfoData | null) => void;
}

function CourseSelectorContent({
  onSelectionChange,
  onCourseHover,
}: CourseSelectorProps) {
  const searchParams = useSearchParams();
  const [courses, setCourses] = useState<CourseInfoData[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCourses, setSelectedCourses] = useState<CourseInfoData[]>([]);

  useEffect(() => {
    const savedCourses = localStorage.getItem("selectedCourses");
    if (savedCourses) {
      const parsedCourses = JSON.parse(savedCourses);
      setSelectedCourses(parsedCourses);
      onSelectionChange(parsedCourses);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      const params = new URLSearchParams(searchParams.toString());
      try {
        const response = await fetch(`/api/course-info?${params.toString()}`);
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
    const newSelectedCourses = isSelected
      ? [...selectedCourses, course]
      : selectedCourses.filter((c) => c.course_code !== course.course_code);

    setSelectedCourses(newSelectedCourses);
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
      <CardHeader>課程選擇</CardHeader>
      <CardContent>
        <Suspense fallback={<ListSkeleton />}>
          <CourseSelectorContent {...props} />
        </Suspense>
      </CardContent>
    </Card>
  );
}
