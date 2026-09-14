"use client";

import { Suspense, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useSearchParams } from "next/navigation";
import type { Session } from "next-auth";
import { Search } from "lucide-react";
import { useMediaQuery } from "usehooks-ts";
import useSWR from "swr";

import CourseListSkeleton from "@/components/schedule-simulator/CourseListSkeleton";
import CourseSelector from "@/components/schedule-simulator/CourseSelector";
import Frame from "@/components/schedule-simulator/Frame";
import ScheduleCard from "@/components/schedule-simulator/ScheduleCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { toast } from "@/components/ui/toast";
import useSelectedCourses from "@/hooks/useSelectedCourses";
import { useHydrated } from "@/hooks/useHydrated";
import {
  CourseTerm,
  getConfiguredCourseTerm,
  getCourseQueryParams,
  parseTermParams,
} from "@/lib/courseIdentity";
import { Course } from "@/types/course";

interface HomeScheduleViewProps {
  session: Session | null;
}

export default function HomeScheduleView({ session }: HomeScheduleViewProps) {
  const searchParams = useSearchParams();
  const { data: termsResult } = useSWR(
    "/api/course-terms",
    async (url: string) => fetch(url).then((res) => res.json()),
  );
  const terms: CourseTerm[] = useMemo(
    () => termsResult?.data ?? [],
    [termsResult?.data],
  );
  const selectedTerm = useMemo(
    () =>
      parseTermParams(searchParams) ??
      getConfiguredCourseTerm() ??
      terms[0] ??
      null,
    [searchParams, terms],
  );
  const {
    selectedCourses,
    setSelectedCourses,
    removeCourse,
    importCourses,
    syncSchedule,
    restoreFromDb,
    isSyncing,
    isDirty,
  } = useSelectedCourses(selectedTerm);
  const [hoveredCourse, setHoveredCourse] = useState<Course | null>(null);
  const isDesktop = useMediaQuery("(min-width: 768px)", {
    initializeWithValue: false,
  });
  const hydrated = useHydrated();

  const codesParam = searchParams.get("codes");

  const validCodes = useMemo(() => {
    if (!codesParam?.trim()) return [];
    return codesParam
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);
  }, [codesParam]);

  const { data: sharedCourses, isLoading: isLoadingShared } = useSWR(
    validCodes.length > 0 && selectedTerm
      ? `/api/course-info?${getCourseQueryParams(selectedTerm).toString()}&${validCodes.map((c) => `course_codes=${encodeURIComponent(c)}`).join("&")}&page_size=100`
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
      const params = selectedTerm
        ? `?year=${selectedTerm.academic_year}&semester=${selectedTerm.academic_semester}`
        : "";
      window.history.replaceState({}, "", `/${params}`);
    }
  };

  const handleRejectShared = () => {
    toast.add({
      type: "info",
      description: "已取消匯入",
    });
    const params = selectedTerm
      ? `?year=${selectedTerm.academic_year}&semester=${selectedTerm.academic_semester}`
      : "";
    window.history.replaceState({}, "", `/${params}`);
  };

  return (
    <Frame>
      {isDesktop ? (
        <div className="w-full min-w-0 md:w-1/3">
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
                selectedTerm={selectedTerm}
                selectedCourses={selectedCourses}
                setSelectedCourses={setSelectedCourses}
                onCourseHover={setHoveredCourse}
              />
            </Suspense>
          )}
        </div>
      ) : (
        <Drawer showSwipeHandle>
          {hydrated &&
            createPortal(
              <DrawerTrigger
                render={
                  <Button
                    className="fixed right-4 bottom-4 z-40 size-12 cursor-pointer rounded-full shadow-lg"
                    size="icon-lg"
                    aria-label="開啟課程選單"
                  >
                    <Search className="size-5" />
                  </Button>
                }
              />,
              document.body,
            )}
          <DrawerContent className="h-[calc(100dvh-6rem)]">
            <DrawerHeader>
              <DrawerTitle>課程選擇</DrawerTitle>
              <DrawerDescription className="">
                搜尋並選擇要加入課表的課程
              </DrawerDescription>
            </DrawerHeader>
            <div className="flex min-h-0 flex-1 flex-col p-4">
              {isViewingShared ? (
                <Card className="rounded-sm">
                  <CardHeader>
                    <CardTitle className="text-center">
                      查看分享課表時無法選擇課程
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center text-sm">
                      匯入到您的課表後即可編輯
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <Suspense fallback={<CourseListSkeleton />}>
                  <CourseSelector
                    selectedTerm={selectedTerm}
                    selectedCourses={selectedCourses}
                    setSelectedCourses={setSelectedCourses}
                    onCourseHover={setHoveredCourse}
                    withCard={false}
                  />
                </Suspense>
              )}
            </div>
          </DrawerContent>
        </Drawer>
      )}

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
            selectedTerm={selectedTerm}
          />
        )}
      </div>
    </Frame>
  );
}
