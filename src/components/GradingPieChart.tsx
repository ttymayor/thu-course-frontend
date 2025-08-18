import { Pie, PieChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface GradingItem {
  description: string;
  method: string;
  percentage: number;
}

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

      {/* 表格備用顯示 */}
      <div className="mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>評分方式</TableHead>
              <TableHead>比例</TableHead>
              <TableHead>說明</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {gradingItems.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{item.method}</TableCell>
                <TableCell>
                  <Badge variant="outline">{item.percentage}%</Badge>
                </TableCell>
                <TableCell>{item.description || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
