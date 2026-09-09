"use client";

import { Skeleton } from "../ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function CourseListSkeleton({
  pageSize = 10,
}: {
  pageSize?: number;
}) {
  return (
    <div className="flex h-full flex-col gap-2">
      {/* card skeletons */}
      <div className="h-150 scrollbar-thin overflow-auto">
        <div className="grid grid-cols-1 gap-2 p-px">
          {[...Array(pageSize)].map((_, index) => (
            <Card
              className="w-full animate-pulse rounded-md border"
              key={index}
            >
              <CardHeader>
                <CardTitle>
                  <Skeleton className="h-4 w-1/3 rounded-md" />
                </CardTitle>
              </CardHeader>

              <CardContent>
                <Skeleton className="mb-4 h-4 w-1/2 rounded-md" />
                <Skeleton className="mb-4 h-4 w-1/2 rounded-md" />
                <Skeleton className="mb-4 h-4 w-1/2 rounded-md" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <div className="mt-2 flex justify-center gap-1">
        <div className="flex size-8 items-center justify-center rounded-md">
          <Skeleton className="size-4 rounded-md" />
        </div>
        <Skeleton className="size-8 rounded-md" />
        <div className="flex size-8 items-center justify-center rounded-md">
          <Skeleton className="size-4 rounded-md" />
        </div>
      </div>
    </div>
  );
}
