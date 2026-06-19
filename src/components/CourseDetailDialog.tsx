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
  course: Course | null;
  onClose: () => void;
}

const fetcher = (url: string) =>
  fetch(url)
    .then((r) => r.json())
    .then((data) => (data.data?.[0] as Course) ?? null);

export function CourseDetailDialog({
  course: initialCourse,
  onClose,
}: CourseDetailDialogProps) {
  const courseCode = initialCourse?.course_code ?? null;
  const { data: fetchedCourse, isLoading } = useSWR(
    courseCode && initialCourse
      ? `/api/course-info?academic_year=${initialCourse.academic_year}&academic_semester=${initialCourse.academic_semester}&course_codes=${encodeURIComponent(courseCode)}&page_size=1`
      : null,
    fetcher,
    { revalidateOnFocus: false },
  );

  return (
    <Dialog open={!!courseCode} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="bg-background/50 max-h-[85vh] max-w-[85vw] scrollbar-none overflow-y-auto rounded-3xl p-5 backdrop-blur-lg sm:min-w-[80vw]"
        showCloseButton={false}
        aria-describedby={undefined}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{fetchedCourse?.course_name ?? courseCode}</DialogTitle>
        </DialogHeader>
        {isLoading && (
          <div className="space-y-4 p-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        )}
        {!isLoading && fetchedCourse && (
          <>
            <DetailView courseInfo={fetchedCourse} />
            <Button className="w-full rounded-xl" asChild>
              <Link
                href={`/course-info/term/${fetchedCourse.academic_year}/${fetchedCourse.academic_semester}/${fetchedCourse.course_code}`}
                prefetch={false}
              >
                <ExternalLink />
                課程詳細頁面
              </Link>
            </Button>
          </>
        )}
        {!isLoading && !fetchedCourse && courseCode && (
          <p className="text-muted-foreground p-8 text-center text-sm">
            無法載入課程資訊
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
