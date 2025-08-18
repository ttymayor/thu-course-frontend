import CourseScheduleList from "@/components/CourseScheduleList";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Megaphone } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-4 sm:py-8 px-4 sm:px-6">
        <main className="flex flex-col gap-8 sm:gap-[32px] items-center justify-center">
          <div
            id="schedule"
            className="w-full flex flex-col items-center gap-6"
          >
            <Alert className="max-w-4xl flex gap-3 justify-center items-center">
              <div>
                <Megaphone />
              </div>
              <AlertTitle className="text-sm font-medium text-center">
                所有資訊皆以東海大學課程資訊網為準。
              </AlertTitle>
            </Alert>

            <div className="w-full max-w-4xl">
              <CourseScheduleList />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
