import { generateDefaultOGImage } from "@/lib/ogImage";

export async function GET() {
  return generateDefaultOGImage();
}
