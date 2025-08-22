import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface ListSkeletonProps {
  pageSize?: number;
}

export default function ListSkeleton({ pageSize = 10 }: ListSkeletonProps) {
  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full">
        <TableHeader>
          <TableRow className="h-12">
            <TableHead className="text-center">課程代碼</TableHead>
            <TableHead className="text-center">課程名稱</TableHead>
            <TableHead className="text-center">學分</TableHead>
            <TableHead className="text-center">教師</TableHead>
            <TableHead className="text-center">時間地點</TableHead>
            <TableHead className="text-center">
              系所名稱 / 上課年級
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: pageSize }).map((_, idx) => (
            <TableRow key={`skeleton-${idx}`} className="h-12">
              <TableCell className="text-center">
                <Skeleton className="h-4 w-12 mx-auto" />
              </TableCell>
              <TableCell className="text-center">
                <Skeleton className="h-4 w-32 mx-auto" />
              </TableCell>
              <TableCell className="text-center">
                <Skeleton className="h-6 w-12 mx-auto rounded-full" />
              </TableCell>
              <TableCell className="text-center">
                <Skeleton className="h-4 w-24 mx-auto" />
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
    </div>
  );
}
