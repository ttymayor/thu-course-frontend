"use cache";
import { Suspense } from "react";
import { getCourseByCode } from "@/services/courseService";
import DetailView from "@/components/course-info/DetailView";
import DetailViewSkeleton from "@/components/course-info/DetailViewSkeleton";
import { notFound } from "next/navigation";
import BaseLayout from "@/components/BaseLayout";

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{
    academicYear: string;
    academicSemester: string;
    courseCode: string;
  }>;
}) {
  const { academicYear, academicSemester, courseCode } = await params;
  const term = {
    academic_year: Number(academicYear),
    academic_semester: Number(academicSemester),
  };

  if (
    !Number.isInteger(term.academic_year) ||
    !Number.isInteger(term.academic_semester)
  ) {
    return notFound();
  }

  const courseInfo = await getCourseByCode(courseCode, term);

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
