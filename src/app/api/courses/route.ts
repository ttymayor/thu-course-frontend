import { NextResponse } from "next/server";
import { getCourses } from "@/services/courseService";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const course_code = searchParams.get("course_code") || "";
  const course_name = searchParams.get("course_name") || "";
  const department_code = searchParams.get("department_code") || "";
  const department_name = searchParams.get("department_name") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const page_size = parseInt(searchParams.get("page_size") || "10", 10);

  try {
    const { data, total } = await getCourses({
      course_code,
      course_name,
      department_code,
      department_name,
      page,
      page_size,
    });

    return NextResponse.json(
      { success: true, data, total },
      {
        headers: {
          "Cache-Control": "public, max-age=3600, s-maxage=3600",
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
}
