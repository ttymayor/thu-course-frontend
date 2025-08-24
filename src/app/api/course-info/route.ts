import { NextResponse } from "next/server";
import { getCourseInfo } from "@/lib/courseInfo";

export async function GET(request: Request) {
  const startTime = Date.now();
  const { searchParams } = new URL(request.url);
  const course_code = searchParams.get("course_code") || "";
  const course_name = searchParams.get("course_name") || "";
  const department_code = searchParams.get("department_code") || "";
  const department_name = searchParams.get("department_name") || "";
  const academic_semester = searchParams.get("academic_semester") || "";
  const academic_year = searchParams.get("academic_year") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const page_size = parseInt(searchParams.get("page_size") || "10", 10);
  
  // 支援多個 course_codes 查詢
  const course_codes = searchParams.getAll("course_codes");

  try {
    const { data, total } = await getCourseInfo({
      course_code,
      course_name,
      department_code,
      department_name,
      academic_semester,
      academic_year,
      course_codes,
      page,
      page_size,
    });

    const endTime = Date.now();
    const processingTime = endTime - startTime;

    return NextResponse.json(
      { success: true, data, total },
      {
        headers: {
          "Cache-Control": "public, max-age=3600, s-maxage=3600",
          "X-Data-Source": "database",
          "X-Processing-Time": `${processingTime}ms`,
        },
      }
    );
  } catch (error) {
    console.error("/api/course-info error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch course info" },
      { status: 500 }
    );
  }
}
