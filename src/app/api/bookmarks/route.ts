import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
  getBookmarks,
  addBookmark,
  removeBookmark,
} from "@/services/userService";
import { rateLimit } from "@/lib/rateLimit";

async function getEmail() {
  const session = await getServerSession(authOptions);
  return session?.user?.email ?? null;
}

export async function GET() {
  const email = await getEmail();
  if (!email) return NextResponse.json({ success: false }, { status: 401 });

  const data = await getBookmarks(email);
  return NextResponse.json({ success: true, data });
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
      { status: 400 }
    );
  }

  const data = await addBookmark(email, course_code);
  return NextResponse.json({ success: true, data });
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
      { status: 400 }
    );
  }

  const data = await removeBookmark(email, course_code);
  return NextResponse.json({ success: true, data });
}
