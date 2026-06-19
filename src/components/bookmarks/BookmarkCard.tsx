import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardAction,
} from "@/components/ui/card";
import { Clock, MapPin, Star, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { courseTimeParser } from "@/lib/courseTimeParser";
import Link from "next/link";
import { Course } from "@/types/course";
import { CourseTypeMap } from "@/components/course-info/types";
import RemoveBookmarkDialog from "@/components/bookmarks/RemoveBookmarkDialog";

const courseTypeMap: CourseTypeMap = {
  1: "必修",
  2: "必選",
  3: "選修",
};

export default function BookmarkCard({ course }: { course: Course }) {
  const parsedClassTimes = courseTimeParser(course.basic_info.class_time);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-col gap-2">
          <h1 className="flex items-center gap-2 text-base font-bold">
            <Badge
              variant="outline"
              className="border-foreground/10 self-start px-1.5 font-mono text-[10px]"
            >
              {course.course_code}
            </Badge>
            <Link
              href={`/course-info/term/${course.academic_year}/${course.academic_semester}/${course.course_code}`}
              className="line-clamp-2 underline-offset-4 hover:underline"
            >
              {course.course_name}
            </Link>
          </h1>
        </CardTitle>
        <CardDescription>
          <div className="flex flex-wrap gap-2">
            <Badge variant="ghost" className="text-xs">
              {course.academic_year} 學年度第 {course.academic_semester} 學期
            </Badge>
          </div>
        </CardDescription>
        <CardAction>
          <RemoveBookmarkDialog course={course} />
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="text-muted-foreground flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2.5">
            <Star className="text-primary/70 size-4 shrink-0" />
            <span className="truncate">
              {courseTypeMap[course.course_type] || course.course_type}{" "}
              {course.credits_1} - {course.credits_2}
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <User className="text-primary/70 size-4 shrink-0" />
            <span className="truncate">
              {course.teachers?.length ? course.teachers.join("、") : "未定"}
            </span>
          </div>
          {parsedClassTimes.length > 0 && (
            <div className="flex items-start gap-2.5">
              <Clock className="text-primary/70 mt-0.5 size-4 shrink-0" />
              <div className="flex flex-col gap-y-1">
                {parsedClassTimes.map((entry, index) => (
                  <div
                    key={index}
                    className="flex flex-wrap items-center gap-x-2"
                  >
                    <span>
                      {entry.day} {entry.periods.join(", ")}
                    </span>
                    {entry.location && (
                      <Badge
                        variant="ghost"
                        className="border-foreground/10 px-1.5 text-[10px] [&>svg]:size-2.5"
                      >
                        <MapPin />
                        {entry.location}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
