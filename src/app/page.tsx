import CourseScheduleList from "@/components/CourseScheduleList";
import CourseScheduleListSkeleton from "@/components/CourseScheduleListSkeleton";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Megaphone,
  ExternalLink,
  School,
  BookOpen,
  Users,
  Calendar,
  Star,
  LibraryBig,
} from "lucide-react";
import { Suspense } from "react";

export default function Home() {
  return (
    <div className="container mx-auto py-4 sm:py-8 px-4 sm:px-6 bg-background">
      <main className="flex flex-col gap-8 sm:gap-[32px] items-center justify-center">
        <div id="schedule" className="w-full flex flex-col items-center gap-6">
          <Alert className="max-w-4xl flex gap-3 justify-center items-center">
            <div>
              <Megaphone />
            </div>
            <AlertTitle className="text-sm font-medium text-center">
              所有資訊皆以東海大學課程資訊網為準。
            </AlertTitle>
          </Alert>

          <div className="w-full max-w-4xl">
            <Suspense fallback={<CourseScheduleListSkeleton />}>
              <CourseScheduleList />
            </Suspense>
          </div>

          {/* 學校相關連結區塊 */}
          <div className="w-full max-w-4xl">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <School className="h-5 w-5" />
                  東海大學相關連結
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-accent/50"
                    asChild
                  >
                    <a
                      href="https://course.thu.edu.tw/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <BookOpen className="h-6 w-6" />
                      <span className="text-sm font-medium">課程資訊網</span>
                      <ExternalLink className="h-3 w-3 opacity-60" />
                    </a>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-accent/50"
                    asChild
                  >
                    <a
                      href="https://www.thu.edu.tw/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <School className="h-6 w-6" />
                      <span className="text-sm font-medium">學校首頁</span>
                      <ExternalLink className="h-3 w-3 opacity-60" />
                    </a>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-accent/50"
                    asChild
                  >
                    <a
                      href="https://fsis.thu.edu.tw/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Users className="h-6 w-6" />
                      <span className="text-sm font-medium">學生資訊系統</span>
                      <ExternalLink className="h-3 w-3 opacity-60" />
                    </a>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-accent/50"
                    asChild
                  >
                    <a
                      href="https://ilearn.thu.edu.tw/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <LibraryBig className="h-6 w-6" />
                      <span className="text-sm font-medium">東海 iLearn</span>
                      <ExternalLink className="h-3 w-3 opacity-60" />
                    </a>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-accent/50"
                    asChild
                  >
                    <a
                      href="https://www.thu.edu.tw/web/calendar/page.php?scid=23&sid=36"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Calendar className="h-6 w-6" />
                      <span className="text-sm font-medium">東海行事曆</span>
                      <ExternalLink className="h-3 w-3 opacity-60" />
                    </a>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-accent/50"
                    asChild
                  >
                    <a
                      href="https://www.thu.edu.tw/web/pages/page.php?scid=66&sid=147"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Star className="h-6 w-6" />
                      <span className="text-sm font-medium">新生入學網</span>
                      <ExternalLink className="h-3 w-3 opacity-60" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
