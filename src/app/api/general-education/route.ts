import { NextResponse } from "next/server";
import { getCourseInfo } from "@/lib/courseInfo";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code") || "";
  const name = searchParams.get("name") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);

  const result = await getCourseInfo({
    code,
    name,
    dept: "通識", // 假設通識課程的系所名稱包含"通識"
    page,
    pageSize,
  });

  return NextResponse.json(result);
}
