"use cache";

import { Suspense } from "react";
import { getCourseDetail } from "@/lib/courseDetail";
import CourseDetailView from "@/components/course-detail/View";
import CourseDetailViewSkeleton from "@/components/course-detail/ViewSkeleton";
import Frame from "@/components/course-detail/Frame";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ courseCode: string }>;
}) {
  const { courseCode } = await params;

  const courseDetail = await getCourseDetail(courseCode);

  if (!courseDetail) {
    return null;
  }

  return (
    <Frame>
      <Suspense fallback={<CourseDetailViewSkeleton />}>
        <CourseDetailView courseDetail={courseDetail} />
      </Suspense>
    </Frame>
  );
}
