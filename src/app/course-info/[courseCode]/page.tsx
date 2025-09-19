"use cache";

import { Suspense } from "react";
import { getCourse } from "@/lib/course";
import DetailView from "@/components/course-info/DetailView";
import DetailViewSkeleton from "@/components/course-info/DetailViewSkeleton";
import DetailFrame from "@/components/course-info/DetailFrame";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ courseCode: string }>;
}) {
  const { courseCode } = await params;

  const courseInfo = await getCourse(courseCode);

  if (!courseInfo) {
    return null;
  }

  return (
    <DetailFrame>
      <Suspense fallback={<DetailViewSkeleton />}>
        <DetailView courseInfo={courseInfo} />
      </Suspense>
    </DetailFrame>
  );
}
