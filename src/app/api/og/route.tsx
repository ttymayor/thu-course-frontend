import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Image metadata
export const alt = "東海選課資訊";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export async function GET() {
  const LineSeedRegular = await readFile(
    join(process.cwd(), "assets/LINESeedTW_TTF_Rg.ttf")
  );
  const LineSeedBold = await readFile(
    join(process.cwd(), "assets/LINESeedTW_TTF_Bd.ttf")
  );
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
        }}
      >
        <h2
          style={{
            fontFamily: "LineSeedBold",
            fontWeight: 400,
            fontSize: 64,
            color: "#1f2937",
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
            color: "#416b68",
          }}
        >
          一個更好的東海課程資訊網站
        </span>
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
}
