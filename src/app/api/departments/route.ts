import { NextResponse } from "next/server";
import { getDepartments } from "@/services/departmentService";
import { Department } from "@/types/department";

export async function GET() {
  try {
    const departments: Department[] = await getDepartments();

    return NextResponse.json({
      success: true,
      data: departments,
    });
  } catch (error) {
    console.error("Error fetching departments:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch departments" },
      { status: 500 },
    );
  }
}
