import type { Metadata } from "next";
import { Suspense } from "react";
import ScheduleSimulator from "../../components/schedule-simulator/ScheduleSimulator";

export const metadata: Metadata = {
  title: "排課模擬",
  description: "不知道要選什麼課，那就來排課一下吧",
};

export default function ScheduleSimulatorPage() {
  return (
    <Suspense fallback={<div className="flex flex-col gap-4">載入中...</div>}>
      <ScheduleSimulator />
    </Suspense>
  );
}
