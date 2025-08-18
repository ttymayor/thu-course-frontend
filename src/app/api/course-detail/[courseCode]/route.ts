import { NextRequest, NextResponse } from "next/server";
import { getCourseDetail } from "@/lib/courseDetail";

export async function GET(
  request: NextRequest,
  { params }: { params: { courseCode: string } }
) {
  try {
    const courseCode = params.courseCode;

    if (!courseCode) {
      return NextResponse.json(
        { success: false, error: "Course code is required" },
        { status: 400 }
      );
    }

    const courseDetail = await getCourseDetail(courseCode);

    if (!courseDetail) {
      return NextResponse.json(
        { success: false, error: "Course not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: courseDetail,
    });
  } catch (error) {
    console.error("Error in course detail API:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
