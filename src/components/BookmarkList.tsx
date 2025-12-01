"use client";

import useBookmark from "@/hooks/useBookmark";
import BookmarkCard from "@/components/bookmarks/BookmarkCard";

export default function BookmarkList() {
  const { bookmarks } = useBookmark();

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {bookmarks.length > 0 ? (
        bookmarks.map((bookmark) => (
          <div key={bookmark.course_code} id={bookmark.course_code}>
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
