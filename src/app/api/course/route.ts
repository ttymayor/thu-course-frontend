import { NextResponse } from "next/server";
import { getCourseByCode } from "@/services/courseService";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const course_code = searchParams.get("course_code") || "";

  try {
    const course = await getCourseByCode(course_code);
    if (course) {
      return NextResponse.json({ success: true, data: course });
    } else {
      return NextResponse.json(
        { success: false, error: "Course not found" },
        {
          status: 404,
        },
      );
    }
  } catch (error) {
    console.error("/api/course error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch course" },
      {
        status: 500,
      },
    );
  }
}
