import { NextResponse } from "next/server";
import {
  getBookmarksForTerm,
  addBookmarkForTerm,
  removeBookmarkForTerm,
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

    const data = await getBookmarksForTerm(email, term);
    return NextResponse.json({ success: true, data, term });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to fetch bookmarks" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  const limited = await rateLimit("write");
  if (limited) return limited;

  const email = await getEmail();
  if (!email) return NextResponse.json({ success: false }, { status: 401 });

  const body = await req.json();
  const term = await resolveTerm(body ?? {});
  const { course_code } = body;
  if (!course_code || typeof course_code !== "string") {
    return NextResponse.json(
      { success: false, message: "Missing course_code" },
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
    const data = await addBookmarkForTerm(email, term, course_code);
    return NextResponse.json({ success: true, data, term });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to add bookmark" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  const limited = await rateLimit("write");
  if (limited) return limited;

  const email = await getEmail();
  if (!email) return NextResponse.json({ success: false }, { status: 401 });

  const body = await req.json();
  const term = await resolveTerm(body ?? {});
  const { course_code } = body;
  if (!course_code || typeof course_code !== "string") {
    return NextResponse.json(
      { success: false, message: "Missing course_code" },
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
    const data = await removeBookmarkForTerm(email, term, course_code);
    return NextResponse.json({ success: true, data, term });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to remove bookmark" },
      { status: 500 },
    );
  }
}
