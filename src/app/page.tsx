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
import CourseSchedule from "@/components/course-schedule/CourseSchedule";
import CourseScheduleSkeleton from "@/components/course-schedule/CourseScheduleSkeleton";
import ScheduleSimulatorSkeleton from "@/components/schedule-simulator/ScheduleSimulatorSkeleton";
import HomeScheduleView from "@/components/schedule-simulator/HomeScheduleView";
import { getSession } from "@/lib/auth";
import WelcomeDialog from "@/components/WelcomeDialog";
import { Card, CardContent } from "@/components/ui/card";

async function ScheduleSimulator() {
  const session = await getSession();
  return <HomeScheduleView session={session} />;
}

export default function Home() {
  return (
    <BaseLayout>
      <WelcomeDialog />
      <div className="flex w-full flex-col items-center gap-6">
        <Section id="schedule-simulator">
          <Suspense fallback={<CourseScheduleSkeleton />}>
            <CourseSchedule />
          </Suspense>
          <Suspense fallback={<ScheduleSimulatorSkeleton />}>
            <ScheduleSimulator />
          </Suspense>
        </Section>

        <Section id="faq">
          <div className="flex items-center gap-2">
            <HelpCircle className="size-5" />
            <h2 className="text-xl font-bold">常見問題 FAQ</h2>
          </div>

          <Card className="w-full p-0">
            <CardContent>
              <Accordion className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-base font-medium">
                    我們會蒐集您的個人資料嗎？
                  </AccordionTrigger>
                  <AccordionContent>
                    <p>
                      本網站所有課程資訊皆以東海大學課程資訊網爬蟲後獲取的資料。未登入時，選課模擬器的課表與書籤資料只會儲存在本地端（瀏覽器），不會上傳至伺服器。
                    </p>
                    <p>
                      若您選擇登入並使用課表同步功能，系統會記錄您的登入
                      Email、課程與書籤資料至伺服器，以便跨裝置同步。登入功能僅供東海大學（@go.thu.edu.tw）電子郵件使用。
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-base font-medium">
                    我使用過選課模擬器，但資料不見了？
                  </AccordionTrigger>
                  <AccordionContent>
                    <p>
                      未登入時，資料僅儲存在本地端（瀏覽器）。若不小心清除瀏覽器資料或更換裝置，就可能導致資料遺失。您可以登入並使用課表同步功能保存課程與書籤資料，也建議將選課模擬結果預先儲存分享連結，以備不時之需。
                    </p>
                    <p>
                      請注意，同步資料不代表永久保存，若長時間未使用或登入狀態過期，伺服器可能會清除相關資料。建議定期儲存重要的課表資訊（可藉由分享課表連結備份）。
                    </p>
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
            </CardContent>
          </Card>
        </Section>
      </div>
    </BaseLayout>
  );
}
