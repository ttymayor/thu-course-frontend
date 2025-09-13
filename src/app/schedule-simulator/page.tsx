import type { Metadata } from "next";
import ScheduleSimulator from "../../components/schedule-simulator/ScheduleSimulator";

export const metadata: Metadata = {
  title: "排課模擬",
  description: "不知道要選什麼課，那就來排課一下吧",
};

export default function ScheduleSimulatorPage() {
  return <ScheduleSimulator />;
}
