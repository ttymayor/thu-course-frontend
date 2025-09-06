"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Skeleton } from "../ui/skeleton";

export default function CourseListSkeleton({
  pageSize = 10,
}: {
  pageSize?: number;
}) {
  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full">
        <TableHeader>
          <TableRow className="h-12">
            <TableHead className="text-center w-16">選擇</TableHead>
            <TableHead className="text-center">課程資訊</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: pageSize }).map((_, idx) => (
            <TableRow key={`skeleton-${idx}`} className="h-12">
              <TableCell className="text-center">
                <Skeleton className="h-4 w-4 mx-auto" />
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <div>
                    <Skeleton className="h-5 w-16 rounded" />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-5 w-12 rounded-full" />
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
