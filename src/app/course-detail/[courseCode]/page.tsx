"use cache";

import { Suspense } from "react";
import { getCourse } from "@/lib/course";
import View from "@/components/course-detail/View";
import ViewSkeleton from "@/components/course-detail/ViewSkeleton";
import Frame from "@/components/course-detail/Frame";

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
    <Frame>
      <Suspense fallback={<ViewSkeleton />}>
        <View courseInfo={courseInfo} />
      </Suspense>
    </Frame>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ courseCode: string }>;
}) {
  const { courseCode } = await params;

  const courseInfo = await getCourse(courseCode);

  if (!courseInfo) {
    return {
      title: `${courseCode}`,
    };
  }

  return {
    title: `${courseCode} ${courseInfo?.course_name}`,
  };
}
