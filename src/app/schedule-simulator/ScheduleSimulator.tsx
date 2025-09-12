"use client";

import { useState } from "react";
import { CourseData } from "@/components/course-info/types";
import ScheduleTable from "@/components/schedule-simulator/ScheduleTable";
import CourseSelector from "@/components/schedule-simulator/CourseSelector";
import { useLocalStorage } from "foxact/use-local-storage";
import { toast } from "sonner";
import Frame from "@/components/schedule-simulator/Frame";

export default function ScheduleSimulator() {
  const [selectedCourses, setSelectedCourses] = useLocalStorage<CourseData[]>(
    "selectedCourses",
    []
  );
  const [hoveredCourse, setHoveredCourse] = useState<CourseData | null>(null);

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

  return (
    <Frame>
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
    </Frame>
  );
}
