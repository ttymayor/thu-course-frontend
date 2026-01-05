"use cache";

import { Suspense } from "react";
import { getCourseByCode } from "@/services/courseService";
import DetailView from "@/components/course-info/DetailView";
import DetailViewSkeleton from "@/components/course-info/DetailViewSkeleton";
import DetailFrame from "@/components/course-info/DetailFrame";
import { notFound } from "next/navigation";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ courseCode: string }>;
}) {
  const { courseCode } = await params;

  const courseInfo = await getCourseByCode(courseCode);

  if (!courseInfo) {
    return notFound();
  }

  return (
    <DetailFrame>
      <Suspense fallback={<DetailViewSkeleton />}>
        <DetailView courseInfo={courseInfo} />
      </Suspense>
    </DetailFrame>
  );
}
