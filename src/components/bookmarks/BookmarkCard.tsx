import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Bookmark, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { courseTimeParser } from "@/lib/courseTimeParser";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CourseData } from "@/components/course-info/types";
import { CourseTypeMap } from "@/components/course-info/types";
import RemoveBookmarkDialog from "@/components/bookmarks/RemoveBookmarkDialog";

const courseTypeMap: CourseTypeMap = {
  1: "必修",
  2: "必選",
  3: "選修",
};

export default function BookmarkCard({ course }: { course: CourseData }) {
  return (
    <Card className="group relative h-full overflow-hidden">
      <Bookmark className="text-muted absolute -top-20 -right-20 size-60 transition-all group-hover:fill-current" />

      <CardHeader className="relative z-10">
        <CardTitle className="flex flex-col gap-2">
          <h1 className="flex items-center gap-2 text-base font-bold">
            <code className="bg-muted rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
              {course.course_code}
            </code>{" "}
            {course.course_name ? `${course.course_name} ` : "-"}
            <Badge variant={"secondary"} className="text-xs">
              {courseTypeMap[course.course_type] || course.course_type}{" "}
              {course.credits_1}-{course.credits_2}
            </Badge>
          </h1>
        </CardTitle>
        <CardDescription>
          <div className="flex flex-wrap gap-2">
            {course.teachers.map((teacher, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {teacher}
              </Badge>
            ))}
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="relative z-10">
        <ul className="list-none [&>li]:my-2">
          <li className="">
            上課時間：
            {courseTimeParser(course.class_time || "").map((entry, index) => (
              <span key={entry.day}>
                {index > 0 && "、"}
                {entry.day} {entry.periods.join(", ")}
                {entry.location && `［${entry.location}］`}
              </span>
            ))}
          </li>
          <li>修課對象：{course.target_class || "-"}</li>
          <li>修課年級：{course.target_grade || "-"}</li>
          <li>選課說明：{course.enrollment_notes || "-"}</li>
        </ul>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Link
          href={`/course-info/${course.course_code}`}
          prefetch={false}
          className="group"
        >
          <Button variant="secondary" size="sm" className="cursor-pointer">
            查看課程
            <ExternalLink className="h-4 w-4" />
          </Button>
        </Link>
        <RemoveBookmarkDialog course={course} />
      </CardFooter>
    </Card>
  );
}
