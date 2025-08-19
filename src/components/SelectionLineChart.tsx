"use client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
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

interface SelectionRecord {
  date: string;
  enrolled: number;
  registered: number;
  remaining: number;
}

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
      <ChartContainer config={chartConfig}>
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
            dot={{
              fill: "#0088FE",
            }}
            activeDot={{
              r: 6,
            }}
          />
          <Line
            type="monotone"
            dataKey="registered"
            stroke="#00C49F"
            strokeWidth={2}
            dot={{
              fill: "#00C49F",
            }}
          />
          <Line
            type="monotone"
            dataKey="remaining"
            stroke="#FFBB28"
            strokeWidth={2}
            dot={{
              fill: "#FFBB28",
            }}
          />
        </LineChart>
      </ChartContainer>

      {/* 表格備用顯示 */}
      <div className="mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/3 text-center">日期</TableHead>
              <TableHead className="w-1/3 text-center">
                已選課/上課人數
              </TableHead>
              <TableHead className="w-1/3 text-center">登記人數</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {selectionRecords.map((record, index) => (
              <TableRow key={index}>
                <TableCell className="text-center">{record.date}</TableCell>
                <TableCell className="text-center">
                  {record.enrolled} / {record.remaining + record.enrolled}
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant={"outline"}>{record.registered}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
