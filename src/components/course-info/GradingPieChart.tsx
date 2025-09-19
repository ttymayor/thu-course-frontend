import { Pie, PieChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { GradingItem } from "@/components/course-info/types";

interface GradingPieChartProps {
  gradingItems: GradingItem[];
}

export default function GradingPieChart({
  gradingItems,
}: GradingPieChartProps) {
  // 顏色配置
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
    "#FFC658",
    "#FF6384",
    "#36CFD6",
  ];

  // 準備圖表資料
  const chartData = gradingItems.map((item, index) => ({
    method: item.method,
    percentage: item.percentage,
    fill: COLORS[index % COLORS.length],
  }));

  // 圖表配置
  const chartConfig = {
    percentage: {
      label: "百分比",
    },
    ...Object.fromEntries(
      chartData.map((item, index) => [
        item.method,
        {
          label: item.method,
          color: COLORS[index % COLORS.length],
        },
      ])
    ),
  } satisfies ChartConfig;

  return (
    <>
      <ChartContainer config={chartConfig} className="max-h-[300px]">
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent nameKey="percentage" hideLabel />}
          />
          <Pie
            data={chartData}
            dataKey="percentage"
            label={({ method }) => `${method}`}
            cx="50%"
            cy="50%"
          >
            {/* <LabelList
              dataKey="method"
              className="fill-background"
              stroke="none"
              fontSize={12}
              formatter={(value: keyof typeof chartConfig) =>
                chartConfig[value]?.label
              }
            /> */}
          </Pie>
        </PieChart>
      </ChartContainer>
    </>
  );
}
