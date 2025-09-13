import type { Metadata } from "next";
import SchoolMap from "../../components/school-map/SchoolMap";

export const metadata: Metadata = {
  title: "校園地圖",
  description: "你會迷路嗎？來看看東海大學的校園地圖吧",
};

export default function SchoolMapPage() {
  return <SchoolMap />;
}
