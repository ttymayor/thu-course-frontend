"use client";

import { X, QrCode, Download, Share2 } from "lucide-react";
import { CourseInfoData } from "@/components/course-info/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

  const days = ["一", "二", "三", "四", "五", "六", "日"];
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

      if (navigator.share) {
        try {
          await navigator.share({
            title: "我的課表",
            text: `查看我選的 ${selectedCourses.length} 門課程`,
            url: shareUrl,
          });
        } catch {
          // 用戶取消分享或不支援，回退到複製連結
          await navigator.clipboard.writeText(shareUrl);
          toast.success("課表連結已複製到剪貼簿");
        }
      } else {
        // 複製到剪貼簿
        await navigator.clipboard.writeText(shareUrl);
        toast.success("課表連結已複製到剪貼簿");
      }
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
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-4">
          <CardTitle>排課模擬器</CardTitle>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <span className="font-medium text-foreground">
                {selectedCourses.length}
              </span>
              <span>門課程</span>
            </div>
            <div className="flex items-center gap-1">
              <span>共計</span>
              <span className="font-medium text-foreground">
                {totalCredits}
              </span>
              <span>學分</span>
            </div>
            <div className="flex items-center gap-1">
              <span>
                {totalCredits >= 20
                  ? "你選的課好多喔，要多休息喔"
                  : "祝你穩過這幾學分 ><"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="cursor-pointer"
            size="sm"
            onClick={shareSchedule}
            disabled={selectedCourses.length === 0}
          >
            <Share2 className="h-4 w-4 mr-2" />
            分享課表
          </Button>
          <Dialog open={isQrDialogOpen} onOpenChange={setIsQrDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="cursor-pointer"
                size="sm"
                onClick={generateQrCode}
                disabled={selectedCourses.length === 0}
              >
                <QrCode className="h-4 w-4 mr-2" />
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
                      className="border rounded-lg"
                    />
                    <Button
                      className="cursor-pointer"
                      onClick={downloadQrCode}
                      variant="outline"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      下載 QR Code
                    </Button>
                    <p className="text-sm text-muted-foreground text-center">
                      包含 {selectedCourses.length} 門課程
                    </p>
                  </>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20 text-center font-medium">
                  時段
                </TableHead>
                {days.map((day) => (
                  <TableHead key={day} className="w-32 text-center font-medium">
                    {day}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {periods.map((period) => (
                <TableRow key={period}>
                  <TableCell className="w-20 text-center font-medium py-4">
                    {period}
                  </TableCell>
                  {days.map((day) => (
                    <TableCell
                      key={`${day}-${period}`}
                      className="w-32 p-2 h-24 align-top"
                    >
                      {grid[day]?.[period]?.map((course) => (
                        <div
                          key={course.course_code}
                          className="relative bg-indigo-100 dark:bg-indigo-900 p-2 rounded-md mb-1 text-xs h-full flex flex-col justify-center"
                        >
                          <code className="text-center">
                            {course.course_code}
                          </code>
                          <p className="font-semibold text-center">
                            {course.course_name}
                          </p>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-0 right-0 h-4 w-4 mt-1 mr-1 cursor-pointer"
                            onClick={() => onRemoveCourse(course.course_code)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
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
