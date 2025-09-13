import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  const LineSeedRegularUrl = new URL(
    `${
      process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000"
    }/fonts/LINESeedTW_TTF_Rg.ttf`,
    import.meta.url
  );
  const LineSeedBoldUrl = new URL(
    `${
      process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000"
    }/fonts/LINESeedTW_TTF_Bd.ttf`,
    import.meta.url
  );
  const LineSeedRegular = await fetch(LineSeedRegularUrl).then((res) =>
    res.arrayBuffer()
  );
  const LineSeedBold = await fetch(LineSeedBoldUrl).then((res) =>
    res.arrayBuffer()
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
