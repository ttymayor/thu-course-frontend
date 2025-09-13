"use cache";

import { Suspense } from "react";
import { getCourse } from "@/lib/course";
import View from "@/components/course-info/View";
import ViewSkeleton from "@/components/course-info/ViewSkeleton";
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
      <Suspense fallback={<ViewSkeleton />}>
        <View courseInfo={courseInfo} />
      </Suspense>
    </DetailFrame>
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
    description: courseInfo?.course_description,
  };
}
