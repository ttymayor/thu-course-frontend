"use client";

import { useLocalStorage } from "foxact/use-local-storage";
import { Course } from "@/types/course";
import { toast } from "sonner";

export default function useBookmark() {
  const [bookmarks, setBookmarks] = useLocalStorage<Course[]>("bookmarks", []);

  const addBookmark = (course: Course) => {
    if (isBookmarked(course)) {
      toast.error("此課程已加入書籤");
      return;
    }
    setBookmarks([...bookmarks, course]);
    toast.success("已加入書籤");
  };

  const removeBookmark = (course: Course) => {
    if (!isBookmarked(course)) {
      toast.error("此課程未加入書籤");
      return;
    }
    setBookmarks(bookmarks.filter((b) => b.course_code !== course.course_code));
    toast.success("已移除書籤");
  };

  const isBookmarked = (course: Course) => {
    return bookmarks.some((b) => b.course_code === course.course_code);
  };

  return { bookmarks, addBookmark, removeBookmark, isBookmarked };
}
