import { NextResponse } from "next/server";
import { getAllDepartments } from "@/lib/course";

export async function GET() {
  try {
    const departments = await getCachedDepartments();

    return NextResponse.json({
      success: true,
      data: departments,
    });
  } catch (error) {
    console.error("Error fetching departments:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch departments" },
      { status: 500 }
    );
  }
}

async function getCachedDepartments() {
  "use cache";
  const cachedDepartments = await getAllDepartments();
  return cachedDepartments;
}
