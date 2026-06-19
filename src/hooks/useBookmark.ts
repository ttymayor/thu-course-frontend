"use client";

import { useSession } from "next-auth/react";
import useSWR, { mutate as mutateGlobal } from "swr";
import { Course } from "@/types/course";
import { toast } from "sonner";
import {
  CourseTerm,
  getCourseQueryParams,
  isSameTerm,
} from "@/lib/courseIdentity";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function useBookmark(activeTerm?: CourseTerm) {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated" && !!session?.user?.email;
  const { data: termsRes } = useSWR("/api/course-terms", fetcher);
  const selectedTerm: CourseTerm | null =
    activeTerm ?? termsRes?.data?.[0] ?? null;
  const termQuery = selectedTerm
    ? getCourseQueryParams(selectedTerm).toString()
    : "";

  const {
    data: codesRes,
    mutate: mutateCodes,
    isLoading: codesLoading,
  } = useSWR(
    isAuthenticated && selectedTerm ? `/api/bookmarks?${termQuery}` : null,
    fetcher,
  );
  const bookmarkCodes: string[] = codesRes?.data ?? [];

  const codesQuery =
    bookmarkCodes.length > 0
      ? bookmarkCodes
          .map((c) => `course_codes=${encodeURIComponent(c)}`)
          .join("&") + `&${termQuery}&page_size=${bookmarkCodes.length}`
      : null;
  const { data: coursesRes } = useSWR(
    isAuthenticated && codesQuery ? `/api/course-info?${codesQuery}` : null,
    fetcher,
  );
  const bookmarks: Course[] = coursesRes?.data ?? [];

  const isLoading = status === "loading" || (isAuthenticated && codesLoading);

  const isBookmarked = (course: Course) =>
    isSameTerm(selectedTerm, course) &&
    bookmarkCodes.includes(course.course_code);

  const addBookmark = async (course: Course) => {
    if (isBookmarked(course)) {
      toast.error("此課程已加入書籤");
      return;
    }
    mutateCodes({ data: [...bookmarkCodes, course.course_code] }, false);
    try {
      const courseTerm = {
        academic_year: course.academic_year,
        academic_semester: course.academic_semester,
      };
      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          course_code: course.course_code,
          ...courseTerm,
        }),
      });
      if (res.ok) {
        mutateCodes();
        mutateGlobal("/api/bookmarks/courses");
        toast.success("已加入書籤");
      } else {
        mutateCodes({ data: bookmarkCodes }, false);
        toast.error("加入書籤失敗");
      }
    } catch {
      mutateCodes({ data: bookmarkCodes }, false);
      toast.error("加入書籤失敗");
    }
  };

  const removeBookmark = async (course: Course) => {
    if (!isBookmarked(course)) {
      toast.error("此課程未加入書籤");
      return;
    }
    mutateCodes(
      { data: bookmarkCodes.filter((c) => c !== course.course_code) },
      false,
    );
    try {
      const courseTerm = {
        academic_year: course.academic_year,
        academic_semester: course.academic_semester,
      };
      const res = await fetch("/api/bookmarks", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          course_code: course.course_code,
          ...courseTerm,
        }),
      });
      if (res.ok) {
        mutateCodes();
        mutateGlobal("/api/bookmarks/courses");
        toast.success("已移除書籤");
      } else {
        mutateCodes({ data: bookmarkCodes }, false);
        toast.error("移除書籤失敗");
      }
    } catch {
      mutateCodes({ data: bookmarkCodes }, false);
      toast.error("移除書籤失敗");
    }
  };

  return { bookmarks, addBookmark, removeBookmark, isBookmarked, isLoading };
}
