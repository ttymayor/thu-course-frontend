"use client";

import { useState, useEffect, useRef, useMemo, useReducer } from "react";
import { useSession } from "next-auth/react";
import { Course } from "@/types/course";
import { toast } from "sonner";
import { CourseTerm, getTermKey } from "@/lib/courseIdentity";

async function fetchCoursesByCode(
  codes: string[],
  term: CourseTerm | null,
  signal?: AbortSignal,
): Promise<Course[]> {
  if (codes.length === 0 || !term) return [];
  const query = codes
    .map((c) => `course_codes=${encodeURIComponent(c)}`)
    .join("&");
  const termQuery = `academic_year=${term.academic_year}&academic_semester=${term.academic_semester}`;
  const res = await fetch(
    `/api/course-info?${query}&${termQuery}&page_size=100`,
    { signal },
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

function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === "AbortError";
}

interface SelectionState {
  initializationKey: string | null;
  courses: Course[];
}

const EMPTY_COURSES: Course[] = [];

export default function useSelectedCourses(term: CourseTerm | null) {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated" && !!session?.user?.email;
  const termStorageKey = term ? getStorageKey(term) : null;
  const termAcademicYear = term?.academic_year ?? null;
  const termAcademicSemester = term?.academic_semester ?? null;
  const currentInitializationKey =
    termStorageKey && status !== "loading"
      ? `${termStorageKey}:${isAuthenticated ? "authenticated" : "local"}`
      : null;

  const [selection, setSelection] = useReducer(
    (_state: SelectionState, next: SelectionState) => next,
    { initializationKey: null, courses: [] },
  );
  const selectedCourses =
    selection.initializationKey === currentInitializationKey
      ? selection.courses
      : EMPTY_COURSES;
  // Tracks what's currently saved in DB so isDirty can be computed dynamically
  const [dbCodes, setDbCodes] = useState<string[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const initializedTermRef = useRef<string | null>(null);
  const loadingTermRef = useRef<string | null>(null);

  // Dirty when current in-memory schedule differs from what DB has
  const isDirty = useMemo(() => {
    const currentSorted = selectedCourses
      .map((c) => c.course_code)
      .sort()
      .join(",");
    const dbSorted = (dbCodes.toSorted?.() ?? dbCodes.slice().sort()).join(",");
    return currentSorted !== dbSorted;
  }, [selectedCourses, dbCodes]);

  useEffect(() => {
    if (
      !termStorageKey ||
      termAcademicYear === null ||
      termAcademicSemester === null
    )
      return;
    if (status === "loading") return;

    const activeTerm: CourseTerm = {
      academic_year: termAcademicYear,
      academic_semester: termAcademicSemester,
    };
    const initializationKey = currentInitializationKey;
    if (!initializationKey) return;
    if (initializedTermRef.current === initializationKey) return;

    const abortController = new AbortController();
    loadingTermRef.current = initializationKey;
    const isCurrentTerm = () =>
      !abortController.signal.aborted &&
      loadingTermRef.current === initializationKey;
    const markInitialized = () => {
      if (isCurrentTerm()) {
        initializedTermRef.current = initializationKey;
      }
    };

    const storedCodes =
      localStorage.getItem(termStorageKey) ??
      localStorage.getItem("selectedCourseCodes");
    const localCodes = storedCodes
      ? storedCodes.split(",").filter(Boolean)
      : [];

    if (!isAuthenticated) {
      if (localCodes.length > 0) {
        fetchCoursesByCode(localCodes, activeTerm, abortController.signal)
          .then((courses) => {
            if (isCurrentTerm()) {
              setSelection({ initializationKey, courses });
              markInitialized();
            }
          })
          .catch((err) => {
            if (!isAbortError(err)) throw err;
          });
      } else {
        markInitialized();
      }
      return () => abortController.abort();
    }

    // Authenticated: DB is source of truth; overwrite localStorage on load
    fetch(
      `/api/schedule?academic_year=${activeTerm.academic_year}&academic_semester=${activeTerm.academic_semester}`,
      { signal: abortController.signal },
    )
      .then((r) => r.json())
      .then(async (result) => {
        if (!isCurrentTerm()) return;

        const codes: string[] =
          result.success && result.data ? result.data : [];
        setDbCodes(codes);

        if (codes.length > 0) {
          const courses = await fetchCoursesByCode(
            codes,
            activeTerm,
            abortController.signal,
          );
          if (!isCurrentTerm()) return;
          setSelection({ initializationKey, courses });
          writeLocalStorage(courses, activeTerm);
          markInitialized();
        } else {
          setSelection({ initializationKey, courses: [] });
          writeLocalStorage([], activeTerm);
          markInitialized();
        }
      })
      .catch(async (err) => {
        if (isAbortError(err)) return;

        console.error(
          "[useSelectedCourses] Failed to fetch schedule from DB:",
          err,
        );
        toast.error("無法載入雲端課表", {
          description: "已顯示本地儲存的課表，請檢查網路連線。",
        });
        if (localCodes.length > 0) {
          const courses = await fetchCoursesByCode(
            localCodes,
            activeTerm,
            abortController.signal,
          );
          if (isCurrentTerm()) {
            setSelection({ initializationKey, courses });
            markInitialized();
          }
        }
      });

    return () => abortController.abort();
  }, [
    status,
    isAuthenticated,
    termStorageKey,
    termAcademicYear,
    termAcademicSemester,
    currentInitializationKey,
  ]);

  // User-triggered setter — writes to localStorage (DB load never touches localStorage)
  const setSelectedCourses = (courses: Course[]) => {
    setSelection({ initializationKey: currentInitializationKey, courses });
    writeLocalStorage(courses, term);
  };

  const removeCourse = (courseCode: string) => {
    const courseToRemove = selectedCourses.find(
      (c) => c.course_code === courseCode,
    );
    if (courseToRemove) {
      const next = selectedCourses.filter((c) => c.course_code !== courseCode);
      setSelection({
        initializationKey: currentInitializationKey,
        courses: next,
      });
      writeLocalStorage(next, term);

      toast.info("已移除課程", {
        description: `已將 ${courseToRemove.course_name} 從您的課表中移除。`,
        action: {
          label: "復原",
          onClick: () => {
            const restored = [...next, courseToRemove];
            setSelection({
              initializationKey: currentInitializationKey,
              courses: restored,
            });
            writeLocalStorage(restored, term);
          },
        },
      });
    }
  };

  const importCourses = (courses: Course[]) => {
    setSelection({ initializationKey: currentInitializationKey, courses });
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
      setSelection({ initializationKey: currentInitializationKey, courses });
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
    }
    setIsSyncing(false);
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
