"use cache";

import CourseScheduleList from "@/components/CourseScheduleList";
import CourseScheduleListSkeleton from "@/components/CourseScheduleListSkeleton";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Megaphone,
  School,
  BookOpen,
  Users,
  Calendar,
  Star,
  LibraryBig,
  HelpCircle,
  Clock,
} from "lucide-react";
import { Suspense } from "react";
import Link from "next/link";
import {
  ScrollVelocityContainer,
  ScrollVelocityRow,
} from "@/components/ui/scroll-based-velocity";

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

export default async function Home() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <main className="flex flex-col items-center justify-center gap-8 sm:gap-[32px]">
        <div className="flex w-full flex-col items-center gap-6">
          <Section
            id="announcement"
            title="公告"
            icon={<Megaphone className="size-5" />}
          >
            <ScrollVelocityContainer className="bg-card w-full max-w-4xl overflow-hidden rounded-lg p-2">
              <ScrollVelocityRow>
                <p className="px-4 py-2 text-center text-base font-medium">
                  所有資訊皆以{" "}
                  <Link
                    href="https://course.thu.edu.tw/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline"
                  >
                    東海大學課程資訊網
                  </Link>{" "}
                  為準！
                </p>
              </ScrollVelocityRow>
            </ScrollVelocityContainer>
          </Section>

          <Section
            id="course-schedule"
            title="選課時程"
            icon={<Clock className="size-5" />}
          >
            <Suspense fallback={<CourseScheduleListSkeleton />}>
              <CourseScheduleList />
            </Suspense>
          </Section>

          {/* 學校相關連結區塊 */}
          <Section
            id="school-links"
            title="東海大學相關連結"
            icon={<School className="size-5" />}
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {schoolLinks.map((link, index) => {
                const IconComponent = link.icon;
                return (
                  <Button
                    key={index}
                    variant="secondary"
                    className="hover:bg-accent/50 group relative h-auto overflow-hidden p-4 text-center"
                    asChild
                  >
                    <Link href={link.href} prefetch={false}>
                      <div className="relative z-10 flex flex-col items-center gap-2">
                        <p className="text-base font-bold">{link.title}</p>
                        {link.description && (
                          <span className="text-muted-foreground text-sm leading-tight break-words whitespace-normal">
                            {link.description}
                          </span>
                        )}
                      </div>
                      <IconComponent className="absolute -left-8 size-24 opacity-[0.05] transition-all duration-500 group-hover:translate-x-5 group-hover:scale-110 group-hover:rotate-12 group-hover:opacity-20" />
                    </Link>
                  </Button>
                );
              })}
            </div>
          </Section>
          <Section
            id="faq"
            title="常見問題 FAQ"
            icon={<HelpCircle className="size-5" />}
          >
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-base font-medium">
                  我們會蒐集您的個人資料嗎？
                </AccordionTrigger>
                <AccordionContent>
                  不會，我們不會蒐集您的個人資料。本網站所有課程資訊皆以東海大學課程資訊網爬蟲後獲取的資料。選課模擬器也僅在本地端進行計算，不會上傳任何資料到我們的伺服器。
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-base font-medium">
                  我使用過選課模擬器，但資料不見了？
                </AccordionTrigger>
                <AccordionContent>
                  礙於該專案目前只有一人在開發，因此沒有備份功能。若不小心將網頁資料刪除，就可能會導致資料遺失。請務必將選課模擬的結果預先儲存分享連結，以備不時之需。
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-base font-medium">
                  發現了不可預期的錯誤？
                </AccordionTrigger>
                <AccordionContent>
                  歡迎登入後，點選頭像到意見回饋頁面提供資訊
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Section>
        </div>
      </main>
    </div>
  );
}

function Section({
  id,
  title,
  icon,
  children,
}: React.PropsWithChildren<{
  id: string;
  title: string;
  icon: React.ReactNode;
}>) {
  return (
    <section id={id} className="mb-8 w-full max-w-4xl space-y-4">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-xl font-bold">{title}</h2>
      </div>
      {children}
    </section>
  );
}
