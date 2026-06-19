import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import { Course } from "@/types/course";
import useBookmark from "@/hooks/useBookmark";
import { Badge } from "../ui/badge";

export default function RemoveBookmarkDialog({ course }: { course: Course }) {
  const { isBookmarked, removeBookmark } = useBookmark({
    academic_year: course.academic_year,
    academic_semester: course.academic_semester,
  });
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size={"icon-sm"}>
          <Bookmark fill={isBookmarked(course) ? "currentColor" : "none"} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="inline-flex items-center gap-2">
            移除
            <Badge
              variant="outline"
              className="border-foreground/10 self-start px-1.5 font-mono text-[10px]"
            >
              {course.course_code}
            </Badge>
            {course.course_name} 的書籤
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
