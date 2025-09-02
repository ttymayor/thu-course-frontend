"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

// 動態導入地圖組件，禁用 SSR
const Map = dynamic(() => import("@/components/school-map/Map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-gray-100 rounded-lg flex items-center justify-center">
      <p className="text-gray-500">載入地圖中...</p>
    </div>
  ),
});

export default function SchoolMap() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 max-w-7xl">
      <main className="flex flex-col gap-8 sm:gap-[32px] items-center justify-center">
        <h1 className="text-2xl font-bold">校園地圖</h1>
        <Suspense
          fallback={
            <div className="w-full h-[600px] bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">載入地圖中...</p>
            </div>
          }
        >
          <Map />
        </Suspense>
      </main>
    </div>
  );
}
