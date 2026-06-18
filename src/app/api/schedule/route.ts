import { NextResponse } from "next/server";
import {
  getScheduleForTerm,
  saveScheduleForTerm,
} from "@/services/userService";
import { rateLimit } from "@/lib/rateLimit";
import { getEmail } from "@/lib/auth";
import { getLatestCourseTerm } from "@/services/courseService";
import { CourseTerm, parseCourseTerm } from "@/lib/courseIdentity";

async function resolveTerm(
  source: URLSearchParams | Record<string, unknown>,
): Promise<CourseTerm | null> {
  const requestedTerm =
    source instanceof URLSearchParams
      ? parseCourseTerm(
          source.get("academic_year"),
          source.get("academic_semester"),
        )
      : parseCourseTerm(source.academic_year, source.academic_semester);

  return requestedTerm ?? getLatestCourseTerm();
}

export async function GET(request: Request) {
  const email = await getEmail();
  if (!email) return NextResponse.json({ success: false }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const term = await resolveTerm(searchParams);
    if (!term)
      return NextResponse.json({ success: true, data: [], term: null });

    const data = await getScheduleForTerm(email, term);
    return NextResponse.json({ success: true, data, term });
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
  const term = await resolveTerm(body ?? {});

  if (
    !Array.isArray(course_codes) ||
    course_codes.some((c) => typeof c !== "string")
  ) {
    return NextResponse.json(
      { success: false, message: "Invalid course_codes" },
      { status: 400 },
    );
  }

  if (!term) {
    return NextResponse.json(
      { success: false, message: "Missing academic term" },
      { status: 400 },
    );
  }

  try {
    const data = await saveScheduleForTerm(
      email,
      term,
      course_codes as string[],
    );
    return NextResponse.json({ success: true, data, term });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to save schedule" },
      { status: 500 },
    );
  }
}
