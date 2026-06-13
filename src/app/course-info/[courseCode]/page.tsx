"use cache";

import { Suspense } from "react";
import { getCourseByCode } from "@/services/courseService";
import DetailView from "@/components/course-info/DetailView";
import DetailViewSkeleton from "@/components/course-info/DetailViewSkeleton";
import { notFound } from "next/navigation";
import BaseLayout from "@/components/BaseLayout";

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
    <BaseLayout>
      <Suspense fallback={<DetailViewSkeleton />}>
        <DetailView courseInfo={courseInfo} />
      </Suspense>
    </BaseLayout>
  );
}
