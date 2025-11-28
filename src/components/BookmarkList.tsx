"use client";

import { CourseData } from "@/components/course-info/types";
import useBookmark from "@/hooks/useBookmark";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ExternalLink, Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CourseTypeMap } from "@/components/course-info/types";
import { Badge } from "@/components/ui/badge";
import { courseTimeParser } from "@/lib/courseTimeParser";

const courseTypeMap: CourseTypeMap = {
  1: "必修",
  2: "必選",
  3: "選修",
};

function RemoveBookmarkDialog({ course }: { course: CourseData }) {
  const { removeBookmark } = useBookmark();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm" className="cursor-pointer">
          移除
          <Trash className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            移除「
            <code className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
              {course.course_code}
            </code>{" "}
            - {course.course_name}」的書籤
          </DialogTitle>
          <DialogDescription>你確定要移除這個課程的書籤嗎？</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="destructive"
            className="cursor-pointer"
            onClick={() => removeBookmark(course)}
          >
            移除
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function BookmarkList() {
  const { bookmarks } = useBookmark();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {bookmarks.length > 0 ? (
        bookmarks.map((bookmark) => (
          <div key={bookmark.course_code} id={bookmark.course_code}>
            <Bookmark course={bookmark} />
          </div>
        ))
      ) : (
        <div className="col-span-full">
          <p className="text-center text-sm text-muted-foreground">
            你還沒有加入任何書籤
          </p>
        </div>
      )}
    </div>
  );
}

function Bookmark({ course }: { course: CourseData }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex flex-col gap-2">
          <h1 className="text-base font-bold group-hover:underline flex items-center gap-2">
            <code className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
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
      <CardContent>
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
          <Button variant="outline" size="sm" className="cursor-pointer">
            查看課程
            <ExternalLink className="h-4 w-4" />
          </Button>
        </Link>
        <RemoveBookmarkDialog course={course} />
      </CardFooter>
    </Card>
  );
}
