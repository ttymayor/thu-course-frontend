import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getSchedule, saveSchedule } from "@/services/userService";
import { rateLimit } from "@/lib/rateLimit";

async function getEmail() {
  const session = await getServerSession(authOptions);
  return session?.user?.email ?? null;
}

export async function GET() {
  const email = await getEmail();
  if (!email) return NextResponse.json({ success: false }, { status: 401 });

  const data = await getSchedule(email);
  return NextResponse.json({ success: true, data });
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

  const data = await saveSchedule(email, course_codes as string[]);
  return NextResponse.json({ success: true, data });
}
