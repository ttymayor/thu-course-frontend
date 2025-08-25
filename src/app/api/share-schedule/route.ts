import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import mongoose from "mongoose";

// 分享資料的 Schema
const shareSchema = new mongoose.Schema({
  shareId: { type: String, required: true, unique: true },
  courseCodes: { type: [String], required: true },
  createdAt: { type: Date, default: Date.now, expires: 2592000 }, // 30 天後自動刪除
});

const ShareSchedule = mongoose.models.ShareSchedule || mongoose.model("ShareSchedule", shareSchema);

// 生成短 ID
function generateShortId(): string {
  return Math.random().toString(36).substring(2, 8) + Date.now().toString(36);
}

export async function POST(request: Request) {
  try {
    await connectMongoDB();
    
    const { courseCodes } = await request.json();
    
    if (!courseCodes || !Array.isArray(courseCodes) || courseCodes.length === 0) {
      return NextResponse.json(
        { success: false, error: "課程代碼不能為空" },
        { status: 400 }
      );
    }

    // 檢查課程數量限制
    if (courseCodes.length > 50) {
      return NextResponse.json(
        { success: false, error: "課程數量不能超過 50 門" },
        { status: 400 }
      );
    }

    const shareId = generateShortId();
    
    const shareSchedule = new ShareSchedule({
      shareId,
      courseCodes: courseCodes.filter(code => code && code.trim()),
    });

    await shareSchedule.save();

    return NextResponse.json({
      success: true,
      shareId,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 天後
    });
  } catch (error) {
    console.error("創建分享連結失敗:", error);
    return NextResponse.json(
      { success: false, error: "創建分享連結失敗" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    await connectMongoDB();
    
    const { searchParams } = new URL(request.url);
    const shareId = searchParams.get("id");
    
    if (!shareId) {
      return NextResponse.json(
        { success: false, error: "分享 ID 不能為空" },
        { status: 400 }
      );
    }

    const shareSchedule = await ShareSchedule.findOne({ shareId });
    
    if (!shareSchedule) {
      return NextResponse.json(
        { success: false, error: "分享連結不存在或已過期" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      courseCodes: shareSchedule.courseCodes,
      createdAt: shareSchedule.createdAt,
    });
  } catch (error) {
    console.error("獲取分享資料失敗:", error);
    return NextResponse.json(
      { success: false, error: "獲取分享資料失敗" },
      { status: 500 }
    );
  }
}
