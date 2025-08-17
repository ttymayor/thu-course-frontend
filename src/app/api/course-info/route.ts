import { NextResponse } from "next/server";
import { getCourseInfo } from "@/lib/courseInfo";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code") || "";
  const name = searchParams.get("name") || "";
  const dept = searchParams.get("dept") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);

  // 直接在 DB 層進行查詢與分頁
  const result = await getCourseInfo({
    code,
    name,
    dept,
    page,
    pageSize,
  });

  return NextResponse.json(result);
}
