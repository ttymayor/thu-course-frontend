import { NextResponse } from "next/server";
import { getCourseSchedules } from "@/lib/courseSchedule";

export async function GET() {
  const schedules = await getCourseSchedules();
  return NextResponse.json(schedules);
}
