import BookmarkList from "@/components/BookmarkList";
import { getSession } from "@/lib/auth";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "我的書籤",
  description: "趕快把想選的課程加入書籤，方便下次選課",
};

export default async function BookmarksPage() {
  const session = await getSession();

  if (!session) {
    return (
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <p className="text-muted-foreground text-center text-sm">
          請先
          <Link href="/auth/signin" className="underline">
            登入
          </Link>
          以查看您的書籤。
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <BookmarkList />
    </div>
  );
}
