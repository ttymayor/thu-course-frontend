import dynamic from "next/dynamic";
import type { Metadata } from "next";
import Frame from "@/components/schedule-simulator/Frame";

const ScheduleSimulator = dynamic(() => import("./ScheduleSimulator"), {
  loading: () => (
    <Frame>
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">載入排課模擬器中...</p>
      </div>
    </Frame>
  ),
});

export const metadata: Metadata = {
  title: "排課模擬",
};

export default function ScheduleSimulatorPage() {
  return <ScheduleSimulator />;
}
