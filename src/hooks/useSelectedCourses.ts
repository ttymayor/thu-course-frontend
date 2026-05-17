"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useSession } from "next-auth/react";
import { Course } from "@/types/course";
import { toast } from "sonner";

async function fetchCoursesByCode(codes: string[]): Promise<Course[]> {
  if (codes.length === 0) return [];
  const query = codes
    .map((c) => `course_codes=${encodeURIComponent(c)}`)
    .join("&");
  const res = await fetch(`/api/course-info?${query}&page_size=100`);
  const result = await res.json();
  return result.success && result.data ? (result.data as Course[]) : [];
}

function writeLocalStorage(courses: Course[]) {
  localStorage.setItem(
    "selectedCourseCodes",
    courses.map((c) => c.course_code).join(","),
  );
}

export default function useSelectedCourses() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated" && !!session?.user?.email;

  const [selectedCourses, _setSelectedCourses] = useState<Course[]>([]);
  // Tracks what's currently saved in DB so isDirty can be computed dynamically
  const [dbCodes, setDbCodes] = useState<string[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
  const initializedRef = useRef(false);

  // Dirty when current in-memory schedule differs from what DB has
  const isDirty = useMemo(() => {
    const currentSorted = selectedCourses
      .map((c) => c.course_code)
      .sort()
      .join(",");
    const dbSorted = [...dbCodes].sort().join(",");
    return currentSorted !== dbSorted;
  }, [selectedCourses, dbCodes]);

  useEffect(() => {
    if (status === "loading") return;
    if (initializedRef.current) return;
    initializedRef.current = true;

    const storedCodes = localStorage.getItem("selectedCourseCodes");
    const localCodes = storedCodes
      ? storedCodes.split(",").filter(Boolean)
      : [];

    if (!isAuthenticated) {
      if (localCodes.length > 0) {
        fetchCoursesByCode(localCodes).then((courses) =>
          _setSelectedCourses(courses),
        );
      }
      return;
    }

    // Authenticated: display = union(DB, localStorage); dbCodes drives dirty state
    fetch("/api/schedule")
      .then((r) => r.json())
      .then(async (result) => {
        const codes: string[] =
          result.success && result.data ? result.data : [];
        setDbCodes(codes);

        const localOnlyCodes = localCodes.filter((c) => !codes.includes(c));
        const unionCodes = [...codes, ...localOnlyCodes];

        if (unionCodes.length > 0) {
          const courses = await fetchCoursesByCode(unionCodes);
          _setSelectedCourses(courses);
        }
      })
      .catch(() => {});
  }, [status, isAuthenticated]);

  // User-triggered setter — writes to localStorage (DB load never touches localStorage)
  const setSelectedCourses = (courses: Course[]) => {
    _setSelectedCourses(courses);
    writeLocalStorage(courses);
  };

  const removeCourse = (courseCode: string) => {
    const courseToRemove = selectedCourses.find(
      (c) => c.course_code === courseCode,
    );
    if (courseToRemove) {
      const next = selectedCourses.filter((c) => c.course_code !== courseCode);
      _setSelectedCourses(next);
      writeLocalStorage(next);

      toast.info("已移除課程", {
        description: `已將 ${courseToRemove.course_name} 從您的課表中移除。`,
        action: {
          label: "復原",
          onClick: () => {
            const restored = [...next, courseToRemove];
            _setSelectedCourses(restored);
            writeLocalStorage(restored);
          },
        },
      });
    }
  };

  const importCourses = (courses: Course[]) => {
    _setSelectedCourses(courses);
    writeLocalStorage(courses);
    toast.success("成功匯入課表！", {
      description: `已匯入 ${courses.length} 門課程到您的課表中。`,
    });
  };

  const restoreFromDb = async () => {
    try {
      const res = await fetch("/api/schedule");
      const result = await res.json();
      const codes: string[] = result.success && result.data ? result.data : [];
      const courses = await fetchCoursesByCode(codes);
      _setSelectedCourses(courses);
      setDbCodes(codes);
      writeLocalStorage(courses);
    } catch {
      toast.error("復原失敗，請稍後再試");
    }
  };

  const syncSchedule = async () => {
    if (isSyncing) return;

    if (!isAuthenticated) {
      toast.success("課表已儲存到本地");
      return;
    }

    setIsSyncing(true);
    try {
      const codes = selectedCourses.map((c) => c.course_code);
      const res = await fetch("/api/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ course_codes: codes }),
      });
      if (res.ok) {
        setLastSyncedAt(new Date());
        setDbCodes(codes); // isDirty becomes false automatically
        writeLocalStorage(selectedCourses); // localStorage now matches DB
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
    restoreFromDb,
    isSyncing,
    isDirty,
    lastSyncedAt,
  };
}
