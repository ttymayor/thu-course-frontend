import { getCourseByCode } from "@/services/courseService";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const course_code = searchParams.get("course_code") || "";
  try {
    const course = await getCourseByCode(course_code);
    if (course) {
      return new Response(JSON.stringify({ success: true, data: course }), {
        headers: { "Content-Type": "application/json" },
      });
    } else {
      return new Response(
        JSON.stringify({ success: false, error: "Course not found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  } catch (error) {
    console.error("/api/course error:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Failed to fetch course" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
