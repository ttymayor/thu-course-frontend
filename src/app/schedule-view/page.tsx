"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  timestamp: string;
  source: string;
}

function ScheduleViewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [shareData, setShareData] = useState<ShareData | null>(null);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

  useEffect(() => {
    const loadCourseData = async () => {
      try {
        setIsLoading(true);

        // 檢查是否有分享 ID（最新格式）
        const shareId = searchParams.get("share");
        if (shareId) {
          const response = await fetch(
            `/api/share-schedule?id=${encodeURIComponent(shareId)}`
          );
          const result = await response.json();

          if (!result.success) {
            setError(result.error || "無法載入分享的課表");
            return;
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
            setError("無法載入課程資料");
            return;
          }

          const shareData: ShareData = {
            courses: courseResult.data.map((course: SharedCourse) => ({
              course_code: course.course_code,
              course_name: course.course_name,
              class_time: course.class_time,
              teachers: course.teachers,
              credits_1: course.credits_1,
              department_name: course.department_name,
            })),
            timestamp: result.createdAt,
            source: "thu-course-frontend",
          };

          setShareData(shareData);
          return;
        }

        // 檢查是否有課程代碼參數（直接格式）
        const codesParam = searchParams.get("codes");
        if (codesParam) {
          const courseCodes = codesParam
            .split(",")
            .filter((code) => code.trim());
          if (courseCodes.length === 0) {
            setError("未找到有效的課程代碼");
            return;
          }

          // 通過 API 獲取課程詳細資訊
          const courseParams = courseCodes
            .map((code) => `course_codes=${encodeURIComponent(code.trim())}`)
            .join("&");

          const response = await fetch(
            `/api/course-info?${courseParams}&page_size=100`
          );
          const result = await response.json();

          if (!result.success || !result.data || result.data.length === 0) {
            setError("無法載入課程資料，可能是課程代碼無效");
            return;
          }

          // 轉換為 ShareData 格式
          const shareData: ShareData = {
            courses: result.data.map((course: SharedCourse) => ({
              course_code: course.course_code,
              course_name: course.course_name,
              class_time: course.class_time,
              teachers: course.teachers,
              credits_1: course.credits_1,
              department_name: course.department_name,
            })),
            timestamp: new Date().toISOString(),
            source: "thu-course-frontend",
          };

          setShareData(shareData);
          return;
        }

        // 檢查舊格式的 data 參數（向後兼容）
        const dataParam = searchParams.get("data");
        if (dataParam) {
          try {
            const decoded = JSON.parse(decodeURIComponent(dataParam));
            if (decoded.source !== "thu-course-frontend") {
              setError("無效的課表資料");
              return;
            }
            setShareData(decoded);
            return;
          } catch {
            setError("課表資料格式錯誤");
            return;
          }
        }

        // 都沒有找到
        setError("未找到課表資料");
      } catch (error) {
        console.error("載入課程資料失敗:", error);
        setError("載入課程資料時發生錯誤");
      } finally {
        setIsLoading(false);
      }
    };

    loadCourseData();
  }, [searchParams]);

  const shareSchedule = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "我的課表",
          text: `查看我選的 ${shareData?.courses.length} 門課程`,
          url: window.location.href,
        });
      } catch {
        // 用戶取消分享或不支援
      }
    } else {
      // 複製到剪貼簿
      navigator.clipboard.writeText(window.location.href);
      toast.success("課表連結已複製到剪貼簿");
    }
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
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-red-500 mb-4">{error}</p>
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
      <div className="container max-w-4xl mx-auto px-4 py-8">
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

  const shareDate = new Date(shareData.timestamp).toLocaleDateString("zh-TW");
  const totalCredits = shareData.courses.reduce(
    (sum, course) => sum + course.credits_1,
    0
  );

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              共享課表
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              建立於 {shareDate} • 共 {shareData.courses.length} 門課程 •{" "}
              {totalCredits} 學分
            </p>
          </div>
          <div className="flex gap-2">
            <Dialog
              open={isImportDialogOpen}
              onOpenChange={setIsImportDialogOpen}
            >
              <DialogTrigger asChild>
                <Button className="cursor-pointer" variant="default" size="sm">
                  <Download className="h-4 w-4 mr-2" />
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
              <Share2 className="h-4 w-4 mr-2" />
              分享
            </Button>
          </div>
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
                      <span>{course.class_time || "時間未定"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4" />
                      <span>{course.teachers.join(", ") || "教師未定"}</span>
                    </div>
                  </div>
                </div>

                <div className="md:text-right">
                  <Link href={`/course-detail/${course.course_code}`}>
                    <Button
                      className="cursor-pointer"
                      variant="outline"
                      size="sm"
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
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

export default function ScheduleViewPage() {
  return (
    <Suspense
      fallback={
        <div className="container max-w-4xl mx-auto px-4 py-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p>載入中...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      }
    >
      <ScheduleViewContent />
    </Suspense>
  );
}
