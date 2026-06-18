"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useSession } from "next-auth/react";
import { Course } from "@/types/course";
import { toast } from "sonner";
import { CourseTerm, getTermKey } from "@/lib/courseIdentity";

async function fetchCoursesByCode(
  codes: string[],
  term: CourseTerm | null,
): Promise<Course[]> {
  if (codes.length === 0 || !term) return [];
  const query = codes
    .map((c) => `course_codes=${encodeURIComponent(c)}`)
    .join("&");
  const termQuery = `academic_year=${term.academic_year}&academic_semester=${term.academic_semester}`;
  const res = await fetch(
    `/api/course-info?${query}&${termQuery}&page_size=100`,
  );
  const result = await res.json();
  return result.success && result.data ? (result.data as Course[]) : [];
}

function getStorageKey(term: CourseTerm) {
  return `selectedCourseCodes:${getTermKey(term)}`;
}

function writeLocalStorage(courses: Course[], term: CourseTerm | null) {
  if (!term) return;
  localStorage.setItem(
    getStorageKey(term),
    courses.map((c) => c.course_code).join(","),
  );
}

export default function useSelectedCourses(term: CourseTerm | null) {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated" && !!session?.user?.email;

  const [selectedCourses, _setSelectedCourses] = useState<Course[]>([]);
  // Tracks what's currently saved in DB so isDirty can be computed dynamically
  const [dbCodes, setDbCodes] = useState<string[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const initializedTermRef = useRef<string | null>(null);
  const termStorageKey = term ? getStorageKey(term) : null;

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
    if (!term || !termStorageKey) return;
    if (status === "loading") return;
    if (initializedTermRef.current === termStorageKey) return;
    initializedTermRef.current = termStorageKey;

    const storedCodes =
      localStorage.getItem(termStorageKey) ??
      localStorage.getItem("selectedCourseCodes");
    const localCodes = storedCodes
      ? storedCodes.split(",").filter(Boolean)
      : [];

    if (!isAuthenticated) {
      if (localCodes.length > 0) {
        fetchCoursesByCode(localCodes, term).then((courses) =>
          _setSelectedCourses(courses),
        );
      } else {
        _setSelectedCourses([]);
      }
      return;
    }

    // Authenticated: DB is source of truth; overwrite localStorage on load
    fetch(
      `/api/schedule?academic_year=${term.academic_year}&academic_semester=${term.academic_semester}`,
    )
      .then((r) => r.json())
      .then(async (result) => {
        const codes: string[] =
          result.success && result.data ? result.data : [];
        setDbCodes(codes);

        if (codes.length > 0) {
          const courses = await fetchCoursesByCode(codes, term);
          _setSelectedCourses(courses);
          writeLocalStorage(courses, term);
        } else {
          _setSelectedCourses([]);
          writeLocalStorage([], term);
        }
      })
      .catch(async (err) => {
        console.error(
          "[useSelectedCourses] Failed to fetch schedule from DB:",
          err,
        );
        toast.error("無法載入雲端課表", {
          description: "已顯示本地儲存的課表，請檢查網路連線。",
        });
        if (localCodes.length > 0) {
          const courses = await fetchCoursesByCode(localCodes, term);
          _setSelectedCourses(courses);
        }
      });
  }, [status, isAuthenticated, term, termStorageKey]);

  // User-triggered setter — writes to localStorage (DB load never touches localStorage)
  const setSelectedCourses = (courses: Course[]) => {
    _setSelectedCourses(courses);
    writeLocalStorage(courses, term);
  };

  const removeCourse = (courseCode: string) => {
    const courseToRemove = selectedCourses.find(
      (c) => c.course_code === courseCode,
    );
    if (courseToRemove) {
      const next = selectedCourses.filter((c) => c.course_code !== courseCode);
      _setSelectedCourses(next);
      writeLocalStorage(next, term);

      toast.info("已移除課程", {
        description: `已將 ${courseToRemove.course_name} 從您的課表中移除。`,
        action: {
          label: "復原",
          onClick: () => {
            const restored = [...next, courseToRemove];
            _setSelectedCourses(restored);
            writeLocalStorage(restored, term);
          },
        },
      });
    }
  };

  const importCourses = (courses: Course[]) => {
    _setSelectedCourses(courses);
    writeLocalStorage(courses, term);
    toast.success("成功匯入課表！", {
      description: `已匯入 ${courses.length} 門課程到您的課表中。`,
    });
  };

  const restoreFromDb = async () => {
    try {
      if (!term) return;
      const res = await fetch(
        `/api/schedule?academic_year=${term.academic_year}&academic_semester=${term.academic_semester}`,
      );
      const result = await res.json();
      const codes: string[] = result.success && result.data ? result.data : [];
      const courses = await fetchCoursesByCode(codes, term);
      _setSelectedCourses(courses);
      setDbCodes(codes);
      writeLocalStorage(courses, term);
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

    if (!term) {
      toast.error("尚未選擇學期");
      return;
    }

    setIsSyncing(true);
    try {
      const codes = selectedCourses.map((c) => c.course_code);
      const res = await fetch("/api/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ course_codes: codes, ...term }),
      });
      if (res.ok) {
        setDbCodes(codes); // isDirty becomes false automatically
        writeLocalStorage(selectedCourses, term); // localStorage now matches DB
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
  };
}
