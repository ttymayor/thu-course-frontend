import { NextResponse } from "next/server";
import { getAllDepartments } from "@/lib/courseInfo";

export async function GET() {
  try {
    const departments = await getAllDepartments();

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
