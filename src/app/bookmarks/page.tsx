"use cache";

import BookmarkList from "@/components/BookmarkList";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "我的書籤",
  description: "趕快把想選的課程加入書籤，方便下次選課",
};

export default async function BookmarksPage() {
  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 max-w-7xl">
      <BookmarkList />
    </div>
  );
}
