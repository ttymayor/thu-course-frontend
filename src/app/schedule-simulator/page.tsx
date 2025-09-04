"use client";

import { useState } from "react";
import { CourseInfoData } from "@/components/course-info/types";
import ScheduleTable from "@/components/schedule-simulator/ScheduleTable";
import CourseSelector from "@/components/schedule-simulator/CourseSelector";
import { useLocalStorage } from "foxact/use-local-storage";
import { toast } from "sonner";

export default function ScheduleSimulatorPage() {
  const [selectedCourses, setSelectedCourses] = useLocalStorage<
    CourseInfoData[]
  >("selectedCourses", []);
  const [hoveredCourse, setHoveredCourse] = useState<CourseInfoData | null>(
    null
  );

  const handleSelectionChange = (courses: CourseInfoData[]) => {
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

  const handleCourseHover = (hoveredCourse: CourseInfoData | null) => {
    setHoveredCourse(hoveredCourse);
  };

  return (
    <main className="bg-background container max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-8 md:flex-row">
        {/* 左側：課程選擇，寬度較窄 */}
        <div className="md:w-1/3 w-full md:pr-4 min-w-0">
          <CourseSelector
            selectedCourses={selectedCourses}
            setSelectedCourses={setSelectedCourses}
            onSelectionChange={handleSelectionChange}
            onCourseHover={handleCourseHover}
          />
        </div>

        {/* 右側：課表模擬，寬度較寬 */}
        <div className="md:w-2/3 w-full min-w-0">
          <ScheduleTable
            selectedCourses={selectedCourses}
            hoveredCourse={hoveredCourse}
            onRemoveCourse={handleRemoveCourse}
          />
        </div>
      </div>
    </main>
  );
}
