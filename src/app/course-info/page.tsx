import { Suspense } from "react";
import Frame from "@/components/course-info/Frame";
import Filter from "@/components/course-info/Filter";
import List from "@/components/course-info/List";
import ListSkeleton from "@/components/course-info/ListSkeleton";
import Pagination from "@/components/course-info/Pagination";
import { CourseInfoFilters } from "@/components/course-info/types";
import { getCourseInfo } from "@/lib/courseInfo";

async function CourseInfoData({ filters }: { filters: CourseInfoFilters }) {
  "use cache";

  // 構建 API 查詢參數
  const params: Record<string, string | number> = {
    page: parseInt(filters.page || "1"),
    page_size: 10,
  };

  // 如果選擇了特定系所，直接使用系所篩選
  if (filters.department) {
    params.department_code = filters.department;
    // 在特定系所內搜尋時，只搜尋課程代碼和課程名稱
    if (filters.search) {
      params.course_code = filters.search;
      params.course_name = filters.search;
    }
  } else {
    // 沒有選擇系所時，使用統一搜尋（包含系所代碼）
    if (filters.search) {
      params.course_code = filters.search;
      params.course_name = filters.search;
      params.department_code = filters.search;
    }
  }

  const { data: infos, total } = await getCourseInfo(params);

  return (
    <>
      <List infos={infos} />
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

  const filters: CourseInfoFilters = {
    search: typeof params.search === "string" ? params.search : undefined,
    department:
      typeof params.department === "string" ? params.department : undefined,
    page: typeof params.page === "string" ? params.page : undefined,
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-4 sm:py-8 px-4 sm:px-6">
        <main className="flex flex-col gap-8 sm:gap-[32px] items-center justify-center">
          <div className="w-full flex justify-center">
            <Frame>
              <Filter />
              <Suspense
                fallback={
                  <>
                    <ListSkeleton />
                    <div className="flex justify-center mt-4"></div>
                  </>
                }
              >
                <CourseInfoData filters={filters} />
              </Suspense>
            </Frame>
          </div>
        </main>
      </div>
    </div>
  );
}
