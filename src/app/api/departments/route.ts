import { NextResponse } from "next/server";
import { getDepartments } from "@/services/departmentService";

export async function GET() {
  try {
    const { data } = await getDepartments();

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error fetching departments:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch departments" },
      { status: 500 },
    );
  }
}
