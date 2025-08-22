import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function CourseScheduleListSkeleton() {
  return (
    <Card className="w-full max-w-5xl">
      <CardHeader>
        <CardTitle>選課時程</CardTitle>
        <CardDescription>來看看選課時程表吧</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>選課時程一覽</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px] text-center">階段</TableHead>
              <TableHead className="text-center">狀態</TableHead>
              <TableHead className="text-center">開始時間</TableHead>
              <TableHead className="text-center">結束時間</TableHead>
              <TableHead className="text-center">結果公布時間</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, idx) => (
              <TableRow key={`skeleton-${idx}`}>
                <TableCell className="font-medium text-center">
                  <Skeleton className="h-4 w-16 mx-auto" />
                </TableCell>
                <TableCell className="text-center">
                  <Skeleton className="h-6 w-16 mx-auto rounded-full" />
                </TableCell>
                <TableCell className="text-center">
                  <Skeleton className="h-4 w-32 mx-auto" />
                </TableCell>
                <TableCell className="text-center">
                  <Skeleton className="h-4 w-32 mx-auto" />
                </TableCell>
                <TableCell className="text-center">
                  <Skeleton className="h-4 w-32 mx-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
