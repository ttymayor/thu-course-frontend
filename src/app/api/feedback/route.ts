import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectMongoDB from "@/lib/mongodb";
import { Feedback } from "@/models/Feedback";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(req: Request) {
  const limited = await rateLimit("feedback");
  if (limited) return limited;

  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { type, subject, message, is_anonymous } = body;

    if (!type || !subject || !message) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!["bug", "feature", "other"].includes(type)) {
      return NextResponse.json(
        { success: false, message: "Invalid feedback type" },
        { status: 400 }
      );
    }

    if (subject.length > 200 || message.length > 300) {
      return NextResponse.json(
        { success: false, message: "Subject or message is too long." },
        { status: 400 }
      );
    }

    await connectMongoDB();

    const newFeedback = await Feedback.create({
      user_email_or_anonymous: is_anonymous ? "Anonymous" : session.user.email,
      type,
      subject,
      message,
    });

    return NextResponse.json(
      { success: true, data: newFeedback },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
