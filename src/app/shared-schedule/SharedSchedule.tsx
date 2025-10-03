"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import useSWR from "swr";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  User,
  BookOpen,
  Share2,
  Download,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { courseTimeParser } from "@/lib/courseTimeParser";

interface SharedCourse {
  course_code: string;
  course_name: string;
  class_time: string;
  teachers: string[];
  credits_1: number;
  department_name: string;
}

interface ShareData {
  courses: SharedCourse[];
  source: string;
}

export default function SharedSchedule() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

  // 建立 SWR key 和參數
  const swrKey = useMemo(() => {
    const shareId = searchParams.get("share");
    const codesParam = searchParams.get("codes");
    const dataParam = searchParams.get("data");

    if (shareId) {
      return { type: "share" as const, shareId };
    } else if (codesParam) {
      return { type: "codes" as const, codesParam };
    } else if (dataParam) {
      return { type: "data" as const, dataParam };
    }

    return null;
  }, [searchParams]);

  // SWR fetcher 函數
  const fetcher = async (key: typeof swrKey): Promise<ShareData> => {
    if (!key) {
      throw new Error("未找到課表資料");
    }

    if (key.type === "share") {
      // 處理分享 ID 格式
      if (!key.shareId) {
        throw new Error("分享 ID 不能為空");
      }
      const response = await fetch(
        `/api/share-schedule?id=${encodeURIComponent(key.shareId)}`
      );
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "無法載入分享的課表");
      }

      // 使用分享的課程代碼獲取完整資訊
      const courseCodes = result.courseCodes;
      const courseParams = courseCodes
        .map((code: string) => `course_codes=${encodeURIComponent(code)}`)
        .join("&");

      const courseResponse = await fetch(
        `/api/course-info?${courseParams}&page_size=100`
      );
      const courseResult = await courseResponse.json();

      if (
        !courseResult.success ||
        !courseResult.data ||
        courseResult.data.length === 0
      ) {
        throw new Error("無法載入課程資料");
      }

      return {
        courses: courseResult.data.map((course: SharedCourse) => ({
          course_code: course.course_code,
          course_name: course.course_name,
          class_time: course.class_time,
          teachers: course.teachers,
          credits_1: course.credits_1,
          department_name: course.department_name,
        })),
        source: "thu-course-frontend",
      };
    } else if (key.type === "codes") {
      // 處理課程代碼參數格式
      if (!key.codesParam) {
        throw new Error("課程代碼參數不能為空");
      }
      const courseCodes = key.codesParam
        .split(",")
        .filter((code) => code.trim());

      if (courseCodes.length === 0) {
        throw new Error("未找到有效的課程代碼");
      }

      const courseParams = courseCodes
        .map((code) => `course_codes=${encodeURIComponent(code.trim())}`)
        .join("&");

      const response = await fetch(
        `/api/course-info?${courseParams}&page_size=100`
      );
      const result = await response.json();

      if (!result.success || !result.data || result.data.length === 0) {
        throw new Error("無法載入課程資料，可能是課程代碼無效");
      }

      return {
        courses: result.data.map((course: SharedCourse) => ({
          course_code: course.course_code,
          course_name: course.course_name,
          class_time: course.class_time,
          teachers: course.teachers,
          credits_1: course.credits_1,
          department_name: course.department_name,
        })),
        source: "thu-course-frontend",
      };
    } else if (key.type === "data") {
      // 處理舊格式的 data 參數（向後兼容）
      if (!key.dataParam) {
        throw new Error("資料參數不能為空");
      }
      try {
        const decoded = JSON.parse(decodeURIComponent(key.dataParam));
        if (decoded.source !== "thu-course-frontend") {
          throw new Error("無效的課表資料");
        }
        return decoded;
      } catch {
        throw new Error("課表資料格式錯誤");
      }
    }

    throw new Error("未找到課表資料");
  };

  const { data: shareData, isLoading, error } = useSWR(swrKey, fetcher);

  const shareSchedule = async () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("課表連結已複製到剪貼簿");
  };

  const handleImport = async () => {
    if (!shareData) return;

    try {
      // 直接使用分享的完整課程資料覆蓋當前課表
      localStorage.setItem(
        "selectedCourses",
        JSON.stringify(shareData.courses)
      );

      // 顯示成功訊息
      toast.success("成功匯入課表！", {
        description: `已匯入 ${shareData.courses.length} 門課程到您的課表中。`,
        action: {
          label: "立即查看",
          onClick: () => {
            router.push("/schedule-simulator");
          },
        },
      });

      setIsImportDialogOpen(false);
    } catch (error) {
      console.error("匯入課表失敗:", error);
      toast.error("匯入課表失敗，請稍後再試");
    }
  };

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-red-500 mb-4">
                {error.message || "載入課程資料時發生錯誤"}
              </p>
              <Link href="/schedule-simulator">
                <Button>返回課表模擬器</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading || !shareData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p>{isLoading ? "載入課程資料中..." : "載入中..."}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalCredits = shareData.courses.reduce(
    (sum, course) => sum + course.credits_1,
    0
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            共享課表
          </CardTitle>
          <CardDescription className="flex flex-row gap-2">
            <span className="font-medium text-foreground">
              {shareData.courses.length}
            </span>{" "}
            門課程{" "}
            <span className="font-medium text-foreground">{totalCredits}</span>{" "}
            學分
          </CardDescription>
          <CardAction className="flex gap-2">
            <Dialog
              open={isImportDialogOpen}
              onOpenChange={setIsImportDialogOpen}
            >
              <DialogTrigger asChild>
                <Button className="cursor-pointer" variant="default" size="sm">
                  <Download className="h-4 w-4" />
                  匯入課表
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-500" />
                    確認匯入課表
                  </DialogTitle>
                  <DialogDescription>
                    確定要覆蓋當前課表嗎？這將會替換您目前選擇的所有課程。
                  </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">
                      即將匯入
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      {shareData?.courses.length}
                    </div>
                    <div className="text-blue-600">門課程</div>
                  </div>
                </div>

                <DialogFooter className="flex gap-2">
                  <Button
                    className="cursor-pointer"
                    variant="outline"
                    onClick={() => setIsImportDialogOpen(false)}
                  >
                    取消
                  </Button>
                  <Button className="cursor-pointer" onClick={handleImport}>
                    確定匯入
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button
              className="cursor-pointer"
              variant="outline"
              size="sm"
              onClick={shareSchedule}
            >
              <Share2 className="h-4 w-4" />
              分享
            </Button>
          </CardAction>
        </CardHeader>
      </Card>

      <div className="grid gap-4">
        {shareData.courses.map((course, index) => (
          <Card key={`${course.course_code}-${index}`}>
            <CardContent className="">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">{course.course_code}</Badge>
                    <Badge variant="outline">{course.credits_1} 學分</Badge>
                  </div>
                  <h3 className="font-semibold text-lg mb-1">
                    {course.course_name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {course.department_name}
                  </p>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4" />
                      <span>
                        {courseTimeParser(course.class_time)
                          .map(
                            (entry) =>
                              `${entry.day} ${entry.periods.join(", ")}`
                          )
                          .join(", ") || "-"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4" />
                      <span>{course.teachers.join(", ") || "教師未定"}</span>
                    </div>
                  </div>
                </div>

                <div className="md:text-right">
                  <Link href={`/course-info/${course.course_code}`}>
                    <Button
                      className="cursor-pointer"
                      variant="outline"
                      size="sm"
                    >
                      <BookOpen className="h-4 w-4" />
                      課程詳情
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
