"use client";

import { X, QrCode, Download } from "lucide-react";
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

  const generateQrCode = async () => {
    if (selectedCourses.length === 0) {
      toast.error("請先選擇課程");
      return;
    }

    try {
      const courseCodes = selectedCourses.map((course) => course.course_code);
      const baseUrl = window.location.origin;
      let shareUrl: string;

      // 如果課程太多，使用分享 ID 系統
      if (selectedCourses.length > 15) {
        try {
          const response = await fetch("/api/share-schedule", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ courseCodes }),
          });

          const result = await response.json();

          if (!result.success) {
            throw new Error(result.error || "創建分享連結失敗");
          }

          shareUrl = `${baseUrl}/schedule-view?share=${result.shareId}`;
        } catch (apiError) {
          console.error("使用分享 API 失敗，回退到直接方式:", apiError);
          // 回退到直接方式
          shareUrl = `${baseUrl}/schedule-view?codes=${courseCodes.join(
            ","
          )}&t=${Date.now()}`;
        }
      } else {
        // 課程較少時直接使用 URL 參數
        shareUrl = `${baseUrl}/schedule-view?codes=${courseCodes.join(
          ","
        )}&t=${Date.now()}`;
      }

      // 檢查 URL 長度
      if (shareUrl.length > 2500) {
        toast.error(
          `選擇的課程太多（${selectedCourses.length} 門），無法生成 QR Code。請減少選擇的課程數量到 20 門以下。`
        );
        return;
      }

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
      if (error instanceof Error) {
        if (
          error.message.includes("too big") ||
          error.message.includes("too large")
        ) {
          toast.error(
            "選擇的課程太多，QR Code 無法容納。請減少選擇的課程數量。"
          );
        } else {
          toast.error(`生成 QR Code 失敗：${error.message}`);
        }
      } else {
        toast.error("生成 QR Code 失敗，請稍後再試");
      }
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>排課模擬器</CardTitle>
        <div className="flex gap-2">
          <Dialog open={isQrDialogOpen} onOpenChange={setIsQrDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={generateQrCode}
                disabled={selectedCourses.length === 0}
              >
                <QrCode className="h-4 w-4 mr-2" />
                匯出 QR Code（測試中）
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>課表 QR Code</DialogTitle>
                <DialogDescription>
                  掃描此 QR Code 即可在手機上查看您的課表
                  {selectedCourses.length > 15 && (
                    <span className="block text-sm text-amber-600 mt-1">
                      ⚡ 由於課程較多，已使用智慧壓縮技術生成分享連結
                    </span>
                  )}
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
                    <Button onClick={downloadQrCode} variant="outline">
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
