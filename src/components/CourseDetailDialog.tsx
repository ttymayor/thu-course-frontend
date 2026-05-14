"use client";

import Link from "next/link";
import useSWR from "swr";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import DetailView from "@/components/course-info/DetailView";
import { Course } from "@/types/course";
import { ExternalLink } from "lucide-react";

interface CourseDetailDialogProps {
  courseCode: string | null;
  onClose: () => void;
}

const fetcher = (url: string) =>
  fetch(url)
    .then((r) => r.json())
    .then((data) => (data.data?.[0] as Course) ?? null);

export function CourseDetailDialog({
  courseCode,
  onClose,
}: CourseDetailDialogProps) {
  const { data: course, isLoading } = useSWR(
    courseCode
      ? `/api/course-info?course_codes=${encodeURIComponent(courseCode)}&page_size=1`
      : null,
    fetcher,
    { revalidateOnFocus: false },
  );

  return (
    <Dialog open={!!courseCode} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] min-w-[75vw] overflow-y-auto">
        <DialogHeader className="sr-only">
          <DialogTitle>{course?.course_name ?? courseCode}</DialogTitle>
        </DialogHeader>
        {isLoading && (
          <div className="space-y-4 p-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        )}
        {!isLoading && course && (
          <>
            <div className="flex justify-end px-2 pb-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/course-info/${courseCode}`}>
                  <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                  課程詳細頁面
                </Link>
              </Button>
            </div>
            <DetailView courseInfo={course} />
          </>
        )}
        {!isLoading && !course && courseCode && (
          <p className="text-muted-foreground p-8 text-center text-sm">
            無法載入課程資訊
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
