import dynamic from "next/dynamic";
import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";

// 動態導入客戶端組件
const SharedSchedule = dynamic(() => import("./SharedSchedule"), {
  loading: () => (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-gray-500">載入共享課表中...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  ),
});

export const metadata: Metadata = {
  title: "共享課表",
  description: "預覽和匯入他人分享的課表",
};

export default function SharedSchedulePage() {
  return <SharedSchedule />;
}
