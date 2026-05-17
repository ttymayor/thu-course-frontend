import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * 生成預設的 OG 圖片
 */
export async function generateDefaultOGImage(): Promise<ImageResponse> {
  try {
    const LineSeedRegular = await readFile(
      join(process.cwd(), "public/fonts/LINESeedTW_TTF_Rg.ttf"),
    );
    const LineSeedBold = await readFile(
      join(process.cwd(), "public/fonts/LINESeedTW_TTF_Bd.ttf"),
    );

    return new ImageResponse(
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fae9d1",
        }}
      >
        <h2
          style={{
            fontFamily: "LineSeedBold",
            fontWeight: 700,
            fontSize: 64,
            color: "#342721",
            marginBottom: 16,
          }}
        >
          東海選課資訊
        </h2>
        <span
          style={{
            fontFamily: "LineSeedRegular",
            fontWeight: 400,
            fontSize: 32,
            color: "#cbb18c",
          }}
        >
          一個更好的東海課程資訊網站
        </span>
      </div>,
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
      },
    );
  } catch (error) {
    console.error("Error loading fonts for OG image:", error);

    // 最終備用方案：使用系統字體的簡單圖片
    return new ImageResponse(
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fae9d1",
          fontFamily: "system-ui",
        }}
      >
        <h2
          style={{
            fontSize: 64,
            color: "#342721",
            marginBottom: 16,
          }}
        >
          東海選課資訊
        </h2>
        <span
          style={{
            fontSize: 32,
            color: "#cbb18c",
          }}
        >
          一個更好的東海課程資訊網站
        </span>
      </div>,
      {
        width: 1200,
        height: 630,
      },
    );
  }
}
