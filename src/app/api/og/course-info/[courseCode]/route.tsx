import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getCourseByCode } from "@/services/courseService";
import { generateDefaultOGImage } from "@/lib/ogImage";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ courseCode: string }> }
) {
  try {
    const { courseCode } = await params;

    // 獲取課程資訊
    const courseInfo = await getCourseByCode(courseCode);

    // 載入字體
    const LineSeedRegular = await readFile(
      join(process.cwd(), "public/fonts/LINESeedTW_TTF_Rg.ttf")
    );
    const LineSeedBold = await readFile(
      join(process.cwd(), "public/fonts/LINESeedTW_TTF_Bd.ttf")
    );

    // 如果找不到課程資訊，回傳預設的 OG 圖片
    if (!courseInfo) {
      return generateDefaultOGImage();
    }

    // 處理課程名稱長度，避免過長
    const courseName = courseInfo.course_name || "";
    const displayCourseName =
      courseName.length > 20 ? courseName.substring(0, 20) + "..." : courseName;

    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#E0EFF0",
            padding: "60px",
            position: "relative",
          }}
        >
          <h2
            style={{
              fontFamily: "LineSeedBold",
              fontWeight: 700,
              fontSize: 64,
              color: "#1f2937",
              marginBottom: 16,
            }}
          >
            東海選課資訊
          </h2>

          {/* 課程代碼 */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 16,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                fontFamily: "LineSeedBold",
                fontWeight: 700,
                fontSize: 24,
                color: "#416b68",
                backgroundColor: "#ffffff",
                padding: "8px 24px",
                borderRadius: "8px",
                border: "2px solid #416b68",
              }}
            >
              {courseCode}
            </div>
            {/* 課程名稱 */}
            <div
              style={{
                fontFamily: "LineSeedRegular",
                fontWeight: 400,
                fontSize: 36,
                color: "#1f2937",
                textAlign: "center",
                lineHeight: 1.2,
                // maxWidth: "900px",
              }}
            >
              {displayCourseName}
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: "LineSeedRegular",
            data: LineSeedRegular,
            weight: 400,
            style: "normal",
          },
          {
            name: "LineSeedBold",
            data: LineSeedBold,
            weight: 700,
            style: "normal",
          },
        ],
      }
    );
  } catch (error) {
    console.error("Error generating dynamic OG image:", error);

    // 回傳預設的 OG 圖片
    return generateDefaultOGImage();
  }
}
