"use client";

import { useLocalStorage } from "foxact/use-local-storage";
import { CourseData } from "@/components/course-info/types";
import { toast } from "sonner";

export default function useBookmark() {
  const [bookmarks, setBookmarks] = useLocalStorage<CourseData[]>(
    "bookmarks",
    [],
  );

  const addBookmark = (course: CourseData) => {
    if (isBookmarked(course)) {
      toast.error("此課程已加入書籤");
      return;
    }
    setBookmarks([...bookmarks, course]);
    toast.success("已加入書籤");
  };

  const removeBookmark = (course: CourseData) => {
    if (!isBookmarked(course)) {
      toast.error("此課程未加入書籤");
      return;
    }
    setBookmarks(bookmarks.filter((b) => b.course_code !== course.course_code));
    toast.success("已移除書籤");
  };

  const isBookmarked = (course: CourseData) => {
    return bookmarks.some((b) => b.course_code === course.course_code);
  };

  return { bookmarks, addBookmark, removeBookmark, isBookmarked };
}
