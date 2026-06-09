import { NextResponse } from "next/server";
import { getSchedule, saveSchedule } from "@/services/userService";
import { rateLimit } from "@/lib/rateLimit";
import { getEmail } from "@/lib/auth";

export async function GET() {
  const email = await getEmail();
  if (!email) return NextResponse.json({ success: false }, { status: 401 });

  try {
    const data = await getSchedule(email);
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to fetch schedule" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  const limited = await rateLimit("schedule");
  if (limited) return limited;

  const email = await getEmail();
  if (!email) return NextResponse.json({ success: false }, { status: 401 });

  const body = await req.json();
  const course_codes: unknown = body?.course_codes;

  if (
    !Array.isArray(course_codes) ||
    course_codes.some((c) => typeof c !== "string")
  ) {
    return NextResponse.json(
      { success: false, message: "Invalid course_codes" },
      { status: 400 },
    );
  }

  try {
    const data = await saveSchedule(email, course_codes as string[]);
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to save schedule" },
      { status: 500 },
    );
  }
}
