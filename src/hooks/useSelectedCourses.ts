"use client";

import { useState, useEffect } from "react";
import { CourseData } from "@/components/course-info/types";
import { toast } from "sonner";

export default function useSelectedCourses() {
  const [selectedCourses, setSelectedCourses] = useState<CourseData[]>([]);

  // 從 Local Storage 載入已選課程
  useEffect(() => {
    const storedCodes = localStorage.getItem("selectedCourseCodes");
    if (storedCodes) {
      const codes = storedCodes.split(",").filter((code) => code);
      if (codes.length > 0) {
        fetch(
          `/api/course-info?${codes
            .map((code) => `course_codes=${encodeURIComponent(code)}`)
            .join("&")}&page_size=100`,
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

  // 當選擇的課程改變時，同步更新 Local Storage
  useEffect(() => {
    if (selectedCourses.length >= 0) {
      const courseCodes = selectedCourses.map((c) => c.course_code);
      localStorage.setItem("selectedCourseCodes", courseCodes.join(","));
    }
  }, [selectedCourses]);

  const removeCourse = (courseCode: string) => {
    const courseToRemove = selectedCourses.find(
      (c) => c.course_code === courseCode,
    );
    if (courseToRemove) {
      const newSelectedCourses = selectedCourses.filter(
        (c) => c.course_code !== courseCode,
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

  const importCourses = (courses: CourseData[]) => {
    setSelectedCourses(courses);
    toast.success("成功匯入課表！", {
      description: `已匯入 ${courses.length} 門課程到您的課表中。`,
    });
  };

  return {
    selectedCourses,
    setSelectedCourses,
    removeCourse,
    importCourses,
  };
}
