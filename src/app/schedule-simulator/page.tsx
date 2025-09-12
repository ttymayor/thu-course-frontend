import dynamic from "next/dynamic";
import type { Metadata } from "next";

const ScheduleSimulator = dynamic(() => import("./ScheduleSimulator"));

export const metadata: Metadata = {
  title: "排課模擬",
};

export default function ScheduleSimulatorPage() {
  return <ScheduleSimulator />;
}
