"use client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { SelectionRecord } from "@/components/course-info/types";

interface SelectionLineChartProps {
  selectionRecords: SelectionRecord[];
}

export default function SelectionLineChart({
  selectionRecords,
}: SelectionLineChartProps) {
  // 準備圖表資料
  const chartData = selectionRecords.map((record) => ({
    date: record.date,
    enrolled: record.enrolled,
    registered: record.registered,
    remaining: record.remaining,
  }));

  // 圖表配置
  const chartConfig = {
    enrolled: {
      label: "已選課",
      color: "#519D9E",
    },
    registered: {
      label: "登記",
      color: "#9DC8C8",
    },
    remaining: {
      label: "餘額",
      color: "#58C9B9",
    },
  } satisfies ChartConfig;

  return (
    <>
      <ChartContainer
        config={chartConfig}
        className="aspect-square w-full max-h-[300px]"
      >
        <LineChart
          accessibilityLayer
          data={chartData}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis tickLine={false} axisLine={false} tickMargin={8} width={24} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Line
            type="monotone"
            dataKey="enrolled"
            stroke="#0088FE"
            strokeWidth={2}
            dot={false}
            activeDot={{
              r: 6,
            }}
          />
          <Line
            type="monotone"
            dataKey="registered"
            stroke="#00C49F"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="remaining"
            stroke="#FFBB28"
            strokeWidth={2}
            dot={false}
          />
          <ChartLegend content={<ChartLegendContent />} />
        </LineChart>
      </ChartContainer>
    </>
  );
}
