import { NextResponse } from "next/server";
import { getCourseTerms } from "@/services/courseService";

export async function GET() {
  try {
    const data = await getCourseTerms();
    return NextResponse.json(
      { success: true, data },
      {
        headers: {
          "Cache-Control": "public, max-age=3600, s-maxage=3600",
          "X-Data-Source": "database",
        },
      },
    );
  } catch (error) {
    console.error("/api/course-terms error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch course terms" },
      { status: 500 },
    );
  }
}
