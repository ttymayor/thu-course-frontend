"use client";

import useBookmark from "@/hooks/useBookmark";
import BookmarkCard from "@/components/bookmarks/BookmarkCard";
import { getCourseKey } from "@/lib/courseIdentity";

export default function BookmarkList() {
  const { bookmarks, isLoading } = useBookmark();

  if (isLoading) {
    return (
      <p className="text-muted-foreground text-center text-sm">載入書籤中...</p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {bookmarks.length > 0 ? (
        bookmarks.map((bookmark) => (
          <div key={getCourseKey(bookmark)} id={getCourseKey(bookmark)}>
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
