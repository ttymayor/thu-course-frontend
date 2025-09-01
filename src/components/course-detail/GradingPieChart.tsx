import { Pie, PieChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { GradingItem } from "@/lib/courseDetail";

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
  } satisfies ChartConfig;

  return (
    <>
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square max-h-[250px]"
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie
            data={chartData}
            dataKey="percentage"
            nameKey="method"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label={({ percentage }) => `${percentage}%`}
          />
        </PieChart>
      </ChartContainer>
    </>
  );
}
