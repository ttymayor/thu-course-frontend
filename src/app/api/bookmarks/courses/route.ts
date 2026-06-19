import { NextResponse } from "next/server";
import { getCoursesForTermCodes } from "@/services/courseService";
import { getBookmarkTerms } from "@/services/userService";
import { getEmail } from "@/lib/auth";

export async function GET() {
  const email = await getEmail();
  if (!email) return NextResponse.json({ success: false }, { status: 401 });

  try {
    const bookmarkTerms = await getBookmarkTerms(email);
    const data = await getCoursesForTermCodes(bookmarkTerms);

    return NextResponse.json({
      success: true,
      data,
      total: data.length,
    });
  } catch (error) {
    console.error("/api/bookmarks/courses error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch bookmark courses" },
      { status: 500 },
    );
  }
}
