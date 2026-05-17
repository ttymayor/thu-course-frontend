"use client";

import { useLocalStorage } from "foxact/use-local-storage";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { Course } from "@/types/course";
import { toast } from "sonner";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function useBookmark() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated" && !!session?.user?.email;

  // Fetch bookmark codes from DB
  const {
    data: codesRes,
    mutate: mutateCodes,
    isLoading: codesLoading,
  } = useSWR(isAuthenticated ? "/api/bookmarks" : null, fetcher);
  const bookmarkCodes: string[] = codesRes?.data ?? [];

  // Fetch full course objects for bookmarked codes
  const codesQuery =
    bookmarkCodes.length > 0
      ? bookmarkCodes.map((c) => `course_codes=${encodeURIComponent(c)}`).join("&") +
        `&page_size=${bookmarkCodes.length}`
      : null;
  const { data: coursesRes, isLoading: coursesLoading } = useSWR(
    isAuthenticated && codesQuery ? `/api/course-info?${codesQuery}` : null,
    fetcher,
  );
  const dbBookmarks: Course[] = coursesRes?.data ?? [];

  // LocalStorage fallback for unauthenticated users
  const [localBookmarks, setLocalBookmarks] = useLocalStorage<Course[]>("bookmarks", []);

  const isLoading = status === "loading" || (isAuthenticated && codesLoading);
  const bookmarks = isAuthenticated ? dbBookmarks : localBookmarks;

  const isBookmarked = (course: Course) => {
    if (isAuthenticated) return bookmarkCodes.includes(course.course_code);
    return localBookmarks.some((b) => b.course_code === course.course_code);
  };

  const addBookmark = async (course: Course) => {
    if (isBookmarked(course)) {
      toast.error("此課程已加入書籤");
      return;
    }

    if (isAuthenticated) {
      // Optimistic update on codes so isBookmarked reflects immediately
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
    } else {
      setLocalBookmarks([...localBookmarks, course]);
      toast.success("已加入書籤");
    }
  };

  const removeBookmark = async (course: Course) => {
    if (!isBookmarked(course)) {
      toast.error("此課程未加入書籤");
      return;
    }

    if (isAuthenticated) {
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
    } else {
      setLocalBookmarks(localBookmarks.filter((b) => b.course_code !== course.course_code));
      toast.success("已移除書籤");
    }
  };

  return { bookmarks, addBookmark, removeBookmark, isBookmarked, isLoading };
}
