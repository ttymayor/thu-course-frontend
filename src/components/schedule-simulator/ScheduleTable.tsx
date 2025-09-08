"use client";

import { X, QrCode, Download, Share2 } from "lucide-react";
import Link from "next/link";
import { CourseInfoData } from "@/components/course-info/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { courseTimeParser } from "@/lib/courseTimeParser";
import QRCode from "qrcode";
import React, { useState } from "react";
import Image from "next/image";
import { useLocalStorage } from "foxact/use-local-storage";

interface ScheduleTableProps {
  selectedCourses: CourseInfoData[];
  hoveredCourse?: CourseInfoData | null;
  onRemoveCourse: (courseCode: string) => void;
}

type ScheduleGrid = {
  [day: string]: {
    [period: string]: CourseInfoData[];
  };
};

export default function ScheduleTable({
  selectedCourses,
  hoveredCourse,
  onRemoveCourse,
}: ScheduleTableProps) {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const [isQrDialogOpen, setIsQrDialogOpen] = useState(false);
  const [showWeekend, setShowWeekend] = useLocalStorage("showWeekend", true);

  const allDays = ["一", "二", "三", "四", "五", "六", "日"];
  const days = showWeekend ? allDays : allDays.slice(0, 5);

  // 時間段對應表
  const periodTimeMap = {
    A: { period: "A", startTime: "7:10", endTime: "8:00" },
    "1": { period: "1", startTime: "8:10", endTime: "9:00" },
    "2": { period: "2", startTime: "9:10", endTime: "10:00" },
    "3": { period: "3", startTime: "10:20", endTime: "11:10" },
    "4": { period: "4", startTime: "11:20", endTime: "12:10" },
    B: { period: "B", startTime: "12:10", endTime: "13:00" },
    "5": { period: "5", startTime: "13:10", endTime: "14:00" },
    "6": { period: "6", startTime: "14:10", endTime: "15:00" },
    "7": { period: "7", startTime: "15:20", endTime: "16:10" },
    "8": { period: "8", startTime: "16:20", endTime: "17:10" },
    "9": { period: "9", startTime: "17:20", endTime: "18:10" },
    "10": { period: "10", startTime: "18:20", endTime: "19:10" },
    "11": { period: "11", startTime: "19:20", endTime: "20:10" },
    "12": { period: "12", startTime: "20:20", endTime: "21:10" },
    "13": { period: "13", startTime: "21:20", endTime: "22:10" },
  };

  // 確保時間段按照正確順序排列
  const periods = [
    "A",
    "1",
    "2",
    "3",
    "4",
    "B",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
  ];

  const grid: ScheduleGrid = days.reduce((acc, day) => {
    acc[day] = periods.reduce((periodAcc, period) => {
      periodAcc[period] = [];
      return periodAcc;
    }, {} as { [period: string]: CourseInfoData[] });
    return acc;
  }, {} as ScheduleGrid);

  // 合併 selectedCourses 與 hoveredCourse（不重複）
  const allCourses =
    hoveredCourse &&
    !selectedCourses.some((c) => c.course_code === hoveredCourse.course_code)
      ? [...selectedCourses, hoveredCourse]
      : selectedCourses;

  allCourses.forEach((course) => {
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
      return `${baseUrl}/schedule-view?codes=${courseCodes.join(",")}`;
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>排課模擬器</CardTitle>
        <CardDescription className="flex flex-row gap-2">
          <span className="font-medium text-foreground">
            {selectedCourses.length}
          </span>
          <span>門課程</span>
          <span className="font-medium text-foreground">{totalCredits}</span>
          <span>學分 </span>
        </CardDescription>
        <CardDescription className="flex flex-row gap-2">
          {totalCredits >= 20
            ? "你選的課好多喔，要多休息喔"
            : "祝你穩過這幾學分 ><"}
        </CardDescription>
        <CardAction className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            className="cursor-pointer w-full sm:w-auto"
            size="sm"
            onClick={shareSchedule}
            disabled={selectedCourses.length === 0}
          >
            <Share2 className="h-4 w-4" />
            分享課表
          </Button>
          <Dialog open={isQrDialogOpen} onOpenChange={setIsQrDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="cursor-pointer w-full sm:w-auto"
                size="sm"
                onClick={generateQrCode}
                disabled={selectedCourses.length === 0}
              >
                <QrCode className="h-4 w-4" />
                匯出 QR Code
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
          <div className="flex items-center justify-center gap-3">
            <label
              htmlFor="weekend-toggle"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              顯示周六日
            </label>
            <Switch
              id="weekend-toggle"
              className="cursor-pointer"
              checked={showWeekend}
              onCheckedChange={setShowWeekend}
            />
          </div>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border">
          <Table className="table-fixed w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-8 sm:w-16 text-center font-medium text-xs sm:text-sm px-1 sm:px-2">
                  時段
                </TableHead>
                {days.map((day) => (
                  <TableHead
                    key={day}
                    className="text-center font-medium text-xs sm:text-sm px-1 sm:px-2"
                  >
                    {day}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {periods.map((period) => (
                <TableRow key={period}>
                  <TableCell className="text-center font-medium py-2 sm:py-3 px-1 sm:px-2">
                    <div className="flex flex-col">
                      <span className="text-xs sm:text-sm font-semibold">
                        {
                          periodTimeMap[period as keyof typeof periodTimeMap]
                            .period
                        }
                      </span>
                      <span className="text-[10px] sm:text-xs text-muted-foreground">
                        {
                          periodTimeMap[period as keyof typeof periodTimeMap]
                            .startTime
                        }
                      </span>
                      <span className="text-[10px] sm:text-xs text-muted-foreground">
                        {
                          periodTimeMap[period as keyof typeof periodTimeMap]
                            .endTime
                        }
                      </span>
                    </div>
                  </TableCell>
                  {days.map((day) => (
                    <TableCell
                      key={`${day}-${period}`}
                      className="p-1 sm:p-2 h-16 sm:h-20 align-top"
                    >
                      <div className="h-full flex flex-col">
                        {grid[day]?.[period]?.map((course) => (
                          <div
                            key={course.course_code}
                            className="relative p-0 sm:p-2 shadow-lg shadow-[#02A596]/15 dark:shadow-[#02A596]/15 border border-[#02A596] dark:border-[#02A596] bg-[#E0EFF0] dark:bg-[#416b68] rounded text-[10px] sm:text-xs flex-1 flex flex-col justify-center hover:scale-105 transition-scale duration-300"
                          >
                            <Link
                              href={`/course-detail/${course.course_code}`}
                              className="h-full flex flex-col justify-center"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <code className="text-center text-[9px] sm:text-[12px] leading-tight">
                                {course.course_code}
                              </code>
                              <p className="font-semibold text-center truncate text-[9px] sm:text-[12px] leading-tight mt-0.5">
                                {course.course_name}
                              </p>
                            </Link>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute top-0 right-0 h-3 w-3 sm:h-4 sm:w-4 mt-0.5 mr-0.5 sm:mt-1 sm:mr-1 cursor-pointer opacity-0 hover:opacity-100"
                              onClick={() => onRemoveCourse(course.course_code)}
                            >
                              <X className="h-2 w-2 sm:h-3 sm:w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
