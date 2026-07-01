"use client";

import { useState } from "react";
import CourseScheduleTable from "@/components/CourseScheduleTable";
import { useHydrated } from "@/hooks/useHydrated";

const h = (offset: number) =>
  new Date(Date.now() + offset * 60 * 60 * 1000).toISOString();

function buildScenarios() {
  return {
    active: {
      label: "開放中",
      description: "第二次加退選正在進行，還剩約 2 小時",
      schedules: [
        {
          _id: "1",
          course_stage: "第一次選課",
          start_time: h(-72),
          end_time: h(-48),
          result_publish_time: h(-24),
        },
        {
          _id: "2",
          course_stage: "第二次加退選",
          start_time: h(-2),
          end_time: h(2),
          result_publish_time: h(24),
        },
        {
          _id: "3",
          course_stage: "第三次加退選",
          start_time: h(48),
          end_time: h(72),
          result_publish_time: h(96),
        },
      ],
    },
    active_ending_soon: {
      label: "即將結束（30 分鐘內）",
      description: "測試秒級倒數",
      schedules: [
        {
          _id: "1",
          course_stage: "第二次加退選",
          start_time: h(-2),
          end_time: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
          result_publish_time: h(24),
        },
      ],
    },
    upcoming: {
      label: "即將開始",
      description: "下一個選課階段在 3 小時後開始",
      schedules: [
        {
          _id: "1",
          course_stage: "第一次選課",
          start_time: h(-72),
          end_time: h(-48),
          result_publish_time: h(-24),
        },
        {
          _id: "2",
          course_stage: "第二次加退選",
          start_time: h(3),
          end_time: h(27),
          result_publish_time: h(48),
        },
      ],
    },
    ended: {
      label: "已完結",
      description: "本學期所有選課階段均已結束",
      schedules: [
        {
          _id: "1",
          course_stage: "第一次選課",
          start_time: h(-168),
          end_time: h(-120),
          result_publish_time: h(-96),
        },
        {
          _id: "2",
          course_stage: "第二次加退選",
          start_time: h(-96),
          end_time: h(-72),
          result_publish_time: h(-48),
        },
        {
          _id: "3",
          course_stage: "第三次加退選",
          start_time: h(-48),
          end_time: h(-24),
          result_publish_time: h(-12),
        },
      ],
    },
  } as const;
}

type Scenarios = ReturnType<typeof buildScenarios>;
type ScenarioKey = keyof Scenarios;

export default function DevCourseSchedulePage() {
  const hydrated = useHydrated();
  const [scenarios] = useState<Scenarios>(buildScenarios);
  const [scenario, setScenario] = useState<ScenarioKey>("active");

  if (!hydrated) return null;

  const current = scenarios[scenario];

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-12">
      <div>
        <h1 className="text-2xl font-bold">Dev — 選課時程 Mock</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          模擬不同選課狀態，預覽 CourseScheduleTable badge 行為
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(Object.keys(scenarios) as ScenarioKey[]).map((key) => (
          <button
            type="button"
            key={key}
            onClick={() => setScenario(key)}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              scenario === key
                ? "bg-foreground text-background border-foreground"
                : "hover:bg-muted"
            }`}
          >
            {scenarios[key].label}
          </button>
        ))}
      </div>

      <p className="text-muted-foreground text-sm">{current.description}</p>

      <div className="space-y-2">
        <p className="text-xs font-medium tracking-wide uppercase opacity-50">
          Badge preview
        </p>
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold">排課模擬</span>
          <CourseScheduleTable schedules={[...current.schedules]} />
        </div>
      </div>

      <details className="rounded-lg border">
        <summary className="cursor-pointer px-4 py-2 text-sm font-medium">
          Mock data
        </summary>
        <pre className="overflow-auto p-4 text-xs">
          {JSON.stringify(current.schedules, null, 2)}
        </pre>
      </details>
    </div>
  );
}
