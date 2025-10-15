"use client";

import { X, QrCode, Download, Share2, Settings, Check } from "lucide-react";
import { CourseData } from "@/components/course-info/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { courseTimeParser } from "@/lib/courseTimeParser";
import { allPeriods, allDays, ScheduleGrid } from "@/lib/schedule";
import QRCode from "qrcode";
import { useState, useRef } from "react";
import Image from "next/image";
import { useLocalStorage } from "foxact/use-local-storage";
import { toPng } from "html-to-image";
import { ButtonGroup } from "@/components/ui/button-group";
import ScheduleTable from "./ScheduleTable";

interface ScheduleCardProps {
  selectedCourses: CourseData[];
  hoveredCourse?: CourseData | null;
  onRemoveCourse?: (courseCode: string) => void;
  isViewingShared?: boolean;
  onImportShared?: () => void;
  onRejectShared?: () => void;
}

export default function ScheduleCard({
  selectedCourses,
  hoveredCourse,
  onRemoveCourse,
  isViewingShared = false,
  onImportShared,
  onRejectShared,
}: ScheduleCardProps) {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const [isQrDialogOpen, setIsQrDialogOpen] = useState(false);
  const [showWeekend, setShowWeekend] = useLocalStorage("showWeekend", true);
  const [showAllPeriod, setShowAllPeriod] = useLocalStorage(
    "showAllPeriod",
    true
  );
  const tableRef = useRef<HTMLTableElement>(null);

  const days = showWeekend ? allDays : allDays.slice(0, 5);

  // 合併 selectedCourses 與 hoveredCourse（不重複）用於計算範圍
  const coursesForRange =
    hoveredCourse &&
    !selectedCourses.some((c) => c.course_code === hoveredCourse.course_code)
      ? [...selectedCourses, hoveredCourse]
      : selectedCourses;

  const getMinimumPeriodRange = () => {
    // 如果沒有課程，返回所有時段
    if (coursesForRange.length === 0) {
      return allPeriods;
    }

    let earliestIndex = allPeriods.length - 1; // 初始化為最晚
    let latestIndex = 0; // 初始化為最早

    coursesForRange.forEach((course) => {
      const parsedTimes = courseTimeParser(course.class_time);
      parsedTimes.forEach((time) => {
        time.periods.forEach((periodStr) => {
          // 將時段字串轉換為在 allPeriods 中的索引
          const periodIndex = allPeriods.indexOf(String(periodStr));
          if (periodIndex !== -1) {
            if (periodIndex < earliestIndex) {
              earliestIndex = periodIndex;
            }
            if (periodIndex > latestIndex) {
              latestIndex = periodIndex;
            }
          }
        });
      });
    });

    // 返回範圍（包含結束索引，所以 +1）
    return allPeriods.slice(earliestIndex, latestIndex + 1);
  };

  const periods = showAllPeriod ? allPeriods : getMinimumPeriodRange();

  const grid: ScheduleGrid = days.reduce((acc, day) => {
    acc[day] = periods.reduce((periodAcc, period) => {
      periodAcc[period] = [];
      return periodAcc;
    }, {} as { [period: string]: CourseData[] });
    return acc;
  }, {} as ScheduleGrid);

  // 使用 coursesForRange 來填充課表格子
  coursesForRange.forEach((course) => {
    const parsedTimes = courseTimeParser(course.class_time);
    parsedTimes.forEach((time) => {
      const dayKey = time.day.replace("星期", "");
      if (days.includes(dayKey)) {
        time.periods.forEach((p) => {
          const periodKey = String(p);
          if (grid[dayKey] && grid[dayKey][periodKey]) {
            grid[dayKey][periodKey].push(course);
          }
        });
      }
    });
  });

  const createShareUrl = () => {
    if (selectedCourses.length === 0) {
      return null;
    }

    try {
      const courseCodes = selectedCourses.map((course) => course.course_code);
      const baseUrl = window.location.origin;

      // 直接使用課程代碼作為參數
      return `${baseUrl}/schedule-simulator?codes=${courseCodes.join(",")}`;
    } catch (error) {
      console.error("創建分享連結失敗:", error);
      toast.error("創建分享連結失敗，請稍後再試");
      return null;
    }
  };

  const generateQrCode = async () => {
    if (selectedCourses.length === 0) {
      toast.error("請先選擇課程");
      return;
    }

    try {
      const shareUrl = createShareUrl();
      if (!shareUrl) return;

      // 生成 QR Code
      const qrDataUrl = await QRCode.toDataURL(shareUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
        errorCorrectionLevel: "M",
      });

      setQrCodeDataUrl(qrDataUrl);
      setIsQrDialogOpen(true);
    } catch (error) {
      console.error("生成 QR Code 失敗:", error);
      toast.error("生成 QR Code 失敗，請稍後再試");
    }
  };

  const shareSchedule = async () => {
    if (selectedCourses.length === 0) {
      toast.error("請先選擇課程");
      return;
    }

    try {
      const shareUrl = createShareUrl();
      if (!shareUrl) return;

      await navigator.clipboard.writeText(shareUrl);
      toast.success("課表連結已複製到剪貼簿");
    } catch (error) {
      console.error("分享課表失敗:", error);
      toast.error("分享課表失敗，請稍後再試");
    }
  };

  const downloadQrCode = () => {
    if (qrCodeDataUrl) {
      const link = document.createElement("a");
      link.download = `課表-${new Date().toLocaleDateString()}.png`;
      link.href = qrCodeDataUrl;
      link.click();
    }
  };

  // 計算總學分
  const totalCredits = selectedCourses.reduce(
    (sum, course) => sum + course.credits_1,
    0
  );

  const downloadSchedule = async () => {
    if (!tableRef.current) return;

    if (selectedCourses.length === 0) {
      toast.error("請先選擇課程再下載");
      return;
    }

    const loadingToast = toast.loading("正在生成課表圖片...");

    try {
      // 等待一小段時間讓 DOM 完全渲染
      await new Promise((resolve) => setTimeout(resolve, 100));

      const dataUrl = await toPng(tableRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        skipFonts: false,
        fontEmbedCSS: "",
        style: {
          transform: "scale(1)",
        },
      });

      const link = document.createElement("a");
      link.href = dataUrl;
      const fileName = `東海大學課表_${new Date()
        .toLocaleDateString("zh-TW")
        .replace(/\//g, "-")}.png`;
      link.download = fileName;
      link.click();

      toast.dismiss(loadingToast);
      toast.success(`課表已成功下載：${fileName}`);
    } catch (error) {
      console.error("下載課表失敗:", error);
      toast.dismiss(loadingToast);
      toast.error("下載課表失敗，請稍後再試");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isViewingShared ? "預覽分享的課表" : "排課模擬"}</CardTitle>
        <CardDescription className="flex flex-row gap-2">
          <span className="font-medium text-foreground">
            {selectedCourses.length}
          </span>
          <span>門課程</span>
          <span className="font-medium text-foreground">{totalCredits}</span>
          <span>學分</span>
        </CardDescription>
        <CardAction>
          {isViewingShared ? (
            // 預覽分享課表模式：顯示確認和取消按鈕
            <ButtonGroup>
              <Button
                variant="default"
                className="cursor-pointer"
                size="sm"
                onClick={onImportShared}
              >
                <Check className="h-4 w-4 mr-1" />
                匯入課表
              </Button>
              <Button
                variant="outline"
                className="cursor-pointer"
                size="sm"
                onClick={onRejectShared}
              >
                <X className="h-4 w-4 mr-1" />
                取消
              </Button>
            </ButtonGroup>
          ) : (
            // 正常模式：顯示原有的分享、下載等按鈕
            <ButtonGroup>
              <Button
                variant="outline"
                className="cursor-pointer w-auto"
                size="sm"
                onClick={shareSchedule}
                disabled={selectedCourses.length === 0}
              >
                <Share2 className="h-4 w-4" />
              </Button>
              <Dialog open={isQrDialogOpen} onOpenChange={setIsQrDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="cursor-pointer w-auto"
                    size="sm"
                    onClick={generateQrCode}
                    disabled={selectedCourses.length === 0}
                  >
                    <QrCode className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>課表 QR Code</DialogTitle>
                    <DialogDescription>
                      掃描此 QR Code 即可在手機上查看您的課表
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col items-center space-y-4">
                    {qrCodeDataUrl && (
                      <>
                        <Image
                          src={qrCodeDataUrl}
                          alt="課表 QR Code"
                          width={300}
                          height={300}
                          className="border rounded-lg w-full max-w-[300px]"
                        />
                        <Button
                          className="cursor-pointer w-full sm:w-auto"
                          onClick={downloadQrCode}
                          variant="outline"
                        >
                          <Download className="h-4 w-4" />
                          下載 QR Code
                        </Button>
                        <p className="text-sm text-muted-foreground text-center">
                          共 {selectedCourses.length} 門課程
                        </p>
                      </>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
              <Button
                variant="outline"
                className="cursor-pointer w-auto"
                size="sm"
                onClick={downloadSchedule}
                disabled={selectedCourses.length === 0}
              >
                <Download className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="cursor-pointer w-auto"
                    size="sm"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-auto">
                  <DropdownMenuLabel>顯示偏好</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={showAllPeriod}
                    onCheckedChange={setShowAllPeriod}
                  >
                    顯示所有時段
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={showWeekend}
                    onCheckedChange={setShowWeekend}
                  >
                    顯示週六週日
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </ButtonGroup>
          )}
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border">
          <ScheduleTable
            tableRef={tableRef}
            days={days}
            periods={periods}
            grid={grid}
            hoveredCourse={hoveredCourse || null}
            isViewingShared={isViewingShared}
            onRemoveCourse={onRemoveCourse}
          />
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-center text-center text-sm text-muted-foreground">
        {totalCredits >= 20
          ? "你選的課好多喔，要多休息喔"
          : "祝你穩過這幾學分 ><"}
      </CardFooter>
    </Card>
  );
}
