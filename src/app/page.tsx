import CourseScheduleList from "@/components/CourseScheduleList";
import CourseScheduleListSkeleton from "@/components/CourseScheduleListSkeleton";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Megaphone,
  School,
  BookOpen,
  Users,
  Calendar,
  Star,
  LibraryBig,
} from "lucide-react";
import { Suspense } from "react";

// 學校相關連結配置
const schoolLinks = [
  {
    href: "https://course.thu.edu.tw/",
    icon: BookOpen,
    title: "課程資訊網",
    description: "選課、課表資訊（不如使用這個網站）",
  },
  {
    href: "https://www.thu.edu.tw/",
    icon: School,
    title: "學校首頁",
    description: "學校官網，學校資訊、校園地圖、校園導覽",
  },
  {
    href: "https://fsis.thu.edu.tw/",
    icon: Users,
    title: "學生資訊系統",
    description: "學生資訊系統，學生資訊、成績查詢、選課、課表、宿舍查詢",
  },
  {
    href: "https://ilearn.thu.edu.tw/",
    icon: LibraryBig,
    title: "東海 iLearn",
    description: "該上課、交作業了各位",
  },
  {
    href: "https://www.thu.edu.tw/web/calendar/page.php?scid=23&sid=36",
    icon: Calendar,
    title: "東海行事曆",
    description: "學校行事曆，不能不看",
  },
  {
    href: "https://www.thu.edu.tw/web/pages/page.php?scid=66&sid=147",
    icon: Star,
    title: "新生入學網",
    description: "新生入學必看，繳費、學號啟用、應辦事項",
  },
] as const;

export default function Home() {
  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 max-w-7xl">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {schoolLinks.map((link, index) => {
                    const IconComponent = link.icon;
                    return (
                      <Button
                        key={index}
                        variant="secondary"
                        className="relative h-auto p-4 hover:bg-accent/50 text-center overflow-hidden group"
                        asChild
                      >
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <div className="relative z-10 flex flex-col items-center gap-2">
                            <p className="text-base font-bold">
                              {link.title}
                            </p>
                            {link.description && (
                              <span className="text-sm text-muted-foreground leading-tight break-words whitespace-normal">
                                {link.description}
                              </span>
                            )}
                          </div>
                          <IconComponent className="size-24 absolute -left-8 opacity-[0.05] transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 group-hover:opacity-20 group-hover:translate-x-5" />
                        </a>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
