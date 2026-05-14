"use client";

import { Course } from "@/types/course";
import { courseTimeParser } from "@/lib/courseTimeParser";
import { periodTimeMap } from "@/lib/schedule";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin } from "lucide-react";

const dayLabel: Record<string, string> = {
  一: "週一",
  二: "週二",
  三: "週三",
  四: "週四",
  五: "週五",
  六: "週六",
  日: "週日",
};

interface CourseTimeInfoPanelProps {
  courses: Course[];
}

export default function CourseTimeInfoPanel({
  courses,
}: CourseTimeInfoPanelProps) {
  if (courses.length === 0) return null;

  return (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">課程時間明細</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {courses.map((course) => {
            const entries = courseTimeParser(
              course.basic_info?.class_time ?? "",
            );
            const credits =
              course.academic_semester === 1
                ? course.credits_1
                : course.credits_2;

            return (
              <div
                key={course.course_code}
                className="rounded-md border p-3 text-sm"
              >
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="font-medium">{course.course_name}</span>
                  <Badge variant="outline" className="text-xs">
                    {course.course_code}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {credits} 學分
                  </Badge>
                </div>

                {entries.length > 0 ? (
                  <div className="space-y-1">
                    {entries.map((entry, i) => {
                      const dayKey = entry.day.replace("星期", "");
                      const first = String(entry.periods[0]);
                      const last = String(
                        entry.periods[entry.periods.length - 1],
                      );
                      const startTime =
                        periodTimeMap[first as keyof typeof periodTimeMap]
                          ?.startTime ?? "";
                      const endTime =
                        periodTimeMap[last as keyof typeof periodTimeMap]
                          ?.endTime ?? "";

                      return (
                        <div
                          key={i}
                          className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1"
                        >
                          <span className="text-foreground w-8 shrink-0 font-medium">
                            {dayLabel[dayKey] ?? dayKey}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3 shrink-0" />
                            第&nbsp;{entry.periods.join("、")}&nbsp;節&nbsp;
                            {startTime && endTime
                              ? `(${startTime}–${endTime})`
                              : ""}
                          </span>
                          {entry.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 shrink-0" />
                              {entry.location}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-xs">無時間資訊</p>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
