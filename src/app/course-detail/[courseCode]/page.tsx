"use cache";

import CourseDetailView from "@/components/course-detail/CourseDetailView";
import { getCourseDetail } from "@/lib/courseDetail";

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

  return <CourseDetailView courseDetail={courseDetail} />;
}
