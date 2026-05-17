import { Suspense } from "react";
import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import BaseLayout from "@/components/BaseLayout";
import { Section } from "@/components/Section";
import CourseScheduleList from "@/components/CourseScheduleList";
import CourseScheduleListSkeleton from "@/components/CourseScheduleListSkeleton";
import ScheduleSimulatorSkeleton from "@/components/schedule-simulator/ScheduleSimulatorSkeleton";
import HomeScheduleView from "@/components/schedule-simulator/HomeScheduleView";
import { getSession } from "@/lib/auth";

export default async function Home() {
  const session = await getSession();
  return (
    <BaseLayout>
      <div className="flex w-full flex-col items-center gap-6">
        <Section
          id="schedule-simulator"
          title="排課模擬"
          action={
            <Suspense fallback={<CourseScheduleListSkeleton />}>
              <CourseScheduleList />
            </Suspense>
          }
        >
          <Suspense fallback={<ScheduleSimulatorSkeleton />}>
            <HomeScheduleView session={session} />
          </Suspense>
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
                不會，我們不會蒐集您的個人資料。本網站所有課程資訊皆以東海大學課程資訊網爬蟲後獲取的資料。選課模擬器也僅在本地端進行計算，不會上傳任何資料到我們的伺服器。登入功能會記錄您的登入
                Email，目前僅額外提供意見回饋。
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
    </BaseLayout>
  );
}
