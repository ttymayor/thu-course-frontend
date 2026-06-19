"use client";

import useSWR from "swr";
import BookmarkCard from "@/components/bookmarks/BookmarkCard";
import { getCourseKey } from "@/lib/courseIdentity";
import { Course } from "@/types/course";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function BookmarkList() {
  const { data, error, isLoading } = useSWR("/api/bookmarks/courses", fetcher);
  const bookmarks: Course[] = data?.data ?? [];

  if (isLoading) {
    return (
      <p className="text-muted-foreground text-center text-sm">載入書籤中...</p>
    );
  }

  if (error || data?.success === false) {
    return (
      <p className="text-muted-foreground text-center text-sm">
        無法載入書籤，請稍後再試。
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {bookmarks.length > 0 ? (
        bookmarks.map((bookmark) => (
          <div
            className=""
            key={getCourseKey(bookmark)}
            id={getCourseKey(bookmark)}
          >
            <BookmarkCard course={bookmark} />
          </div>
        ))
      ) : (
        <div className="col-span-full">
          <p className="text-muted-foreground text-center text-sm">
            你還沒有加入任何書籤
          </p>
        </div>
      )}
    </div>
  );
}
