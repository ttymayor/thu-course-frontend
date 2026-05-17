"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Course } from "@/types/course";
import { toast } from "sonner";

async function fetchCoursesByCode(codes: string[]): Promise<Course[]> {
  if (codes.length === 0) return [];
  const query = codes.map((c) => `course_codes=${encodeURIComponent(c)}`).join("&");
  const res = await fetch(`/api/course-info?${query}&page_size=100`);
  const result = await res.json();
  return result.success && result.data ? (result.data as Course[]) : [];
}

export default function useSelectedCourses() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated" && !!session?.user?.email;

  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
  const initialized = useRef(false);

  // Initial load: localStorage first; if empty and authenticated, fall back to DB
  useEffect(() => {
    if (status === "loading") return;
    if (initialized.current) return;
    initialized.current = true;

    const storedCodes = localStorage.getItem("selectedCourseCodes");

    if (storedCodes) {
      const codes = storedCodes.split(",").filter(Boolean);
      if (codes.length > 0) {
        fetchCoursesByCode(codes).then(setSelectedCourses);
        return;
      }
    }

    // localStorage empty — try DB if authenticated
    if (isAuthenticated) {
      fetch("/api/schedule")
        .then((r) => r.json())
        .then((result) => {
          if (result.success && result.data && result.data.length > 0) {
            return fetchCoursesByCode(result.data).then((courses) => {
              setSelectedCourses(courses);
              toast.info("已從雲端載入課表");
            });
          }
        })
        .catch(() => {});
    }
  }, [status, isAuthenticated]);

  // Sync selectedCourses to localStorage whenever they change
  useEffect(() => {
    const courseCodes = selectedCourses.map((c) => c.course_code);
    localStorage.setItem("selectedCourseCodes", courseCodes.join(","));
  }, [selectedCourses]);

  const removeCourse = (courseCode: string) => {
    const courseToRemove = selectedCourses.find(
      (c) => c.course_code === courseCode,
    );
    if (courseToRemove) {
      const next = selectedCourses.filter((c) => c.course_code !== courseCode);
      setSelectedCourses(next);

      toast.info("已移除課程", {
        description: `已將 ${courseToRemove.course_name} 從您的課表中移除。`,
        action: {
          label: "復原",
          onClick: () => {
            setSelectedCourses([...next, courseToRemove]);
          },
        },
      });
    }
  };

  const importCourses = (courses: Course[]) => {
    setSelectedCourses(courses);
    toast.success("成功匯入課表！", {
      description: `已匯入 ${courses.length} 門課程到您的課表中。`,
    });
  };

  const syncSchedule = async () => {
    if (isSyncing) return;

    setIsSyncing(true);
    try {
      const codes = selectedCourses.map((c) => c.course_code);
      const res = await fetch("/api/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ course_codes: codes }),
      });
      if (res.status === 401) {
        toast.error("請先登入以同步課表");
      } else if (res.ok) {
        setLastSyncedAt(new Date());
        toast.success("課表已同步到雲端");
      } else {
        toast.error("同步失敗，請稍後再試");
      }
    } catch {
      toast.error("同步失敗，請稍後再試");
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    selectedCourses,
    setSelectedCourses,
    removeCourse,
    importCourses,
    syncSchedule,
    isSyncing,
    lastSyncedAt,
  };
}
