import { NextResponse } from "next/server";
import {
  getBookmarks,
  addBookmark,
  removeBookmark,
} from "@/services/userService";
import { rateLimit } from "@/lib/rateLimit";
import { getEmail } from "@/lib/auth";

export async function GET() {
  const email = await getEmail();
  if (!email) return NextResponse.json({ success: false }, { status: 401 });

  try {
    const data = await getBookmarks(email);
    return NextResponse.json({ success: true, data });
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

  const { course_code } = await req.json();
  if (!course_code || typeof course_code !== "string") {
    return NextResponse.json(
      { success: false, message: "Missing course_code" },
      { status: 400 },
    );
  }

  try {
    const data = await addBookmark(email, course_code);
    return NextResponse.json({ success: true, data });
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

  const { course_code } = await req.json();
  if (!course_code || typeof course_code !== "string") {
    return NextResponse.json(
      { success: false, message: "Missing course_code" },
      { status: 400 },
    );
  }

  try {
    const data = await removeBookmark(email, course_code);
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to remove bookmark" },
      { status: 500 },
    );
  }
}
