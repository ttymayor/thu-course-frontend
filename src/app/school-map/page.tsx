import dynamic from "next/dynamic";
import type { Metadata } from "next";

const SchoolMap = dynamic(() => import("./SchoolMap"));

export const metadata: Metadata = {
  title: "校園地圖",
};

export default function SchoolMapPage() {
  return <SchoolMap />;
}
