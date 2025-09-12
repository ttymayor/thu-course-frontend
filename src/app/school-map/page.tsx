import dynamic from "next/dynamic";
import Link from "next/link";
import { Suspense } from "react";
import Frame from "@/components/school-map/Frame";
import type { Metadata } from "next";

// 動態導入地圖組件
const Map = dynamic(() => import("@/components/school-map/Map"), {
  loading: () => (
    <div className="w-full h-[600px] bg-gray-100 rounded-lg flex items-center justify-center">
      <p className="text-gray-500">載入地圖中...</p>
    </div>
  ),
});

export const metadata: Metadata = {
  title: "校園地圖",
};

export default function SchoolMap() {
  return (
    <Frame>
      <h1 className="text-2xl font-bold">校園地圖</h1>
      <Suspense
        fallback={
          <div className="w-full h-[600px] bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">載入地圖中...</p>
          </div>
        }
      >
        <Map />
        <div className="text-center">
          <p>
            校內接駁車行駛動線根據：
            <Link
              className="underline"
              href="https://business.thu.edu.tw/web/news/detail.php?cid=1&id=147"
              target="_blank"
              rel="noopener noreferrer"
            >
              【公告】本校校內接駁車行駛動線及搭乘地點調整公告
            </Link>
          </p>
        </div>
      </Suspense>
    </Frame>
  );
}
