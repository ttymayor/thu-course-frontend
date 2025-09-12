"use client";

import Link from "next/link";
import Frame from "@/components/school-map/Frame";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/school-map/Map"), {
  ssr: false,
});

export default function SchoolMap() {
  return (
    <Frame>
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
    </Frame>
  );
}
