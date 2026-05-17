"use client";

import { useSession } from "next-auth/react";
import useSWR from "swr";
import { Course } from "@/types/course";
import { toast } from "sonner";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function useBookmark() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated" && !!session?.user?.email;

  const {
    data: codesRes,
    mutate: mutateCodes,
    isLoading: codesLoading,
  } = useSWR(isAuthenticated ? "/api/bookmarks" : null, fetcher);
  const bookmarkCodes: string[] = codesRes?.data ?? [];

  const codesQuery =
    bookmarkCodes.length > 0
      ? bookmarkCodes
          .map((c) => `course_codes=${encodeURIComponent(c)}`)
          .join("&") + `&page_size=${bookmarkCodes.length}`
      : null;
  const { data: coursesRes } = useSWR(
    isAuthenticated && codesQuery ? `/api/course-info?${codesQuery}` : null,
    fetcher,
  );
  const bookmarks: Course[] = coursesRes?.data ?? [];

  const isLoading = status === "loading" || (isAuthenticated && codesLoading);

  const isBookmarked = (course: Course) =>
    bookmarkCodes.includes(course.course_code);

  const addBookmark = async (course: Course) => {
    if (isBookmarked(course)) {
      toast.error("此課程已加入書籤");
      return;
    }
    mutateCodes({ data: [...bookmarkCodes, course.course_code] }, false);
    try {
      await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ course_code: course.course_code }),
      });
      mutateCodes();
      toast.success("已加入書籤");
    } catch {
      mutateCodes();
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
      await fetch("/api/bookmarks", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ course_code: course.course_code }),
      });
      mutateCodes();
      toast.success("已移除書籤");
    } catch {
      mutateCodes();
      toast.error("移除書籤失敗");
    }
  };

  return { bookmarks, addBookmark, removeBookmark, isBookmarked, isLoading };
}
