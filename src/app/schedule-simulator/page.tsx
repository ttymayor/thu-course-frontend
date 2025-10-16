import type { Metadata } from "next";
import { Suspense } from "react";
import ScheduleSimulator from "@/components/schedule-simulator/ScheduleSimulator";
import ScheduleSimulatorSkeleton from "@/components/schedule-simulator/ScheduleSimulatorSkeleton";

export const metadata: Metadata = {
  title: "排課模擬",
  description: "不知道要選什麼課，那就來排課一下吧",
};

export default async function ScheduleSimulatorPage() {
  return (
    <Suspense fallback={<ScheduleSimulatorSkeleton />}>
      <ScheduleSimulator />
    </Suspense>
  );
}
