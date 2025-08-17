import { NextResponse } from "next/server";
import { getCourseInfo } from "@/lib/courseInfo";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const course_code = searchParams.get("course_code") || "";
  const course_name = searchParams.get("course_name") || "";
  const department_code = searchParams.get("department_code") || "";
  const department_name = searchParams.get("department_name") || "";
  const academic_semester = searchParams.get("academic_semester") || "";
  const academic_year = searchParams.get("academic_year") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const page_size = parseInt(searchParams.get("page_size") || "10", 10);

  const result = await getCourseInfo({
    course_code,
    course_name,
    department_code,
    department_name,
    academic_semester,
    academic_year,
    page,
    page_size,
  });

  return NextResponse.json(result);
}
