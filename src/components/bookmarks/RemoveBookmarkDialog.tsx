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
import { Trash } from "lucide-react";
import { Course } from "@/types/course";
import useBookmark from "@/hooks/useBookmark";

export default function RemoveBookmarkDialog({ course }: { course: Course }) {
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
