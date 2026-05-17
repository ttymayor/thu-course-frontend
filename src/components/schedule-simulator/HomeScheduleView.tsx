"use client";

import { Suspense, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Course } from "@/types/course";
import ScheduleCard from "@/components/schedule-simulator/ScheduleCard";
import CourseSelector from "@/components/schedule-simulator/CourseSelector";
import Frame from "@/components/schedule-simulator/Frame";
import CourseListSkeleton from "@/components/schedule-simulator/CourseListSkeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useSelectedCourses from "@/hooks/useSelectedCourses";
import useSWR from "swr";
import { toast } from "sonner";
import type { Session } from "next-auth";

interface HomeScheduleViewProps {
  session: Session | null;
}

export default function HomeScheduleView({ session }: HomeScheduleViewProps) {
  const searchParams = useSearchParams();
  const {
    selectedCourses,
    setSelectedCourses,
    removeCourse,
    importCourses,
    syncSchedule,
    restoreFromDb,
    isSyncing,
    isDirty,
  } = useSelectedCourses();
  const [hoveredCourse, setHoveredCourse] = useState<Course | null>(null);

  const codesParam = searchParams.get("codes");

  const validCodes = useMemo(() => {
    if (!codesParam?.trim()) return [];
    return codesParam
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);
  }, [codesParam]);

  const { data: sharedCourses, isLoading: isLoadingShared } = useSWR(
    validCodes.length > 0
      ? `/api/course-info?${validCodes.map((c) => `course_codes=${encodeURIComponent(c)}`).join("&")}&page_size=100`
      : null,
    async (url: string) => {
      const res = await fetch(url);
      const result = await res.json();
      if (!result.success || !result.data?.length)
        throw new Error("無法載入課程資料");
      return result.data as Course[];
    },
  );

  const displayCourses = useMemo(
    () =>
      validCodes.length > 0 && sharedCourses ? sharedCourses : selectedCourses,
    [validCodes.length, sharedCourses, selectedCourses],
  );

  const isViewingShared = !!(validCodes.length > 0 && sharedCourses);

  const handleImportShared = () => {
    if (sharedCourses) {
      importCourses(sharedCourses);
      window.history.replaceState({}, "", "/");
    }
  };

  const handleRejectShared = () => {
    toast.info("已取消匯入");
    window.history.replaceState({}, "", "/");
  };

  return (
    <Frame>
      {/* Left: course selector */}
      <div className="w-full min-w-0 md:w-1/3 md:pr-4">
        {isViewingShared ? (
          <Card className="rounded-sm">
            <CardHeader>
              <CardTitle className="text-center">
                查看分享課表時無法選擇課程
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-sm">匯入到您的課表後即可編輯</p>
            </CardContent>
          </Card>
        ) : (
          <Suspense fallback={<CourseListSkeleton />}>
            <CourseSelector
              selectedCourses={selectedCourses}
              setSelectedCourses={setSelectedCourses}
              onCourseHover={setHoveredCourse}
            />
          </Suspense>
        )}
      </div>

      {/* Right: schedule grid + time info */}
      <div className="w-full min-w-0 md:w-2/3">
        {isLoadingShared ? (
          <ScheduleCard selectedCourses={[]} session={null} />
        ) : (
          <ScheduleCard
            selectedCourses={displayCourses}
            hoveredCourse={hoveredCourse}
            onRemoveCourse={isViewingShared ? undefined : removeCourse}
            isViewingShared={isViewingShared}
            onImportShared={handleImportShared}
            onRejectShared={handleRejectShared}
            onSyncSchedule={syncSchedule}
            onRestoreFromDb={restoreFromDb}
            isSyncing={isSyncing}
            isDirty={isDirty}
            session={session}
          />
        )}
      </div>
    </Frame>
  );
}
