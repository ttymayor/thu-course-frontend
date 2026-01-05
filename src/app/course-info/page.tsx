import { Suspense } from "react";
import Frame from "@/components/course-info/Frame";
import Filter from "@/components/course-info/Filter";
import List from "@/components/course-info/List";
import ListSkeleton from "@/components/course-info/ListSkeleton";
import Pagination from "@/components/course-info/Pagination";
import { CourseFilters } from "@/components/course-info/types";
import { getCourses } from "@/services/courseService";
import type { Metadata } from "next";
import { Course } from "@/types/course";

export const metadata: Metadata = {
  title: "課程資訊",
  description: "東海大學的課程資訊",
};

async function CourseData({ filters }: { filters: CourseFilters }) {
  "use cache";

  // 構建 API 查詢參數
  const params: Record<string, string | number> = {
    page: parseInt(filters.page || "1"),
    page_size: 10,
  };

  if (filters.department) {
    params.department_code = filters.department;
  }

  if (filters.search) {
    params.course_code = filters.search;
    params.course_name = filters.search;
  }

  const { data: courses, total } = (await getCourses(params)) as {
    data: Course[];
    total: number;
  };

  return (
    <>
      <List courses={courses} />
      <Pagination total={total} />
    </>
  );
}

export default async function CourseInfoPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  const filters: CourseFilters = {
    search: typeof params.search === "string" ? params.search : undefined,
    department:
      typeof params.department === "string" ? params.department : undefined,
    page: typeof params.page === "string" ? params.page : undefined,
  };

  return (
    <div className="bg-background mx-auto px-4 py-4 sm:px-6 sm:py-8">
      <main className="flex flex-col items-center justify-center gap-8 sm:gap-[32px]">
        <div className="flex w-full justify-center">
          <Frame>
            <Filter />
            <Suspense fallback={<ListSkeleton />}>
              <CourseData filters={filters} />
            </Suspense>
          </Frame>
        </div>
      </main>
    </div>
  );
}
