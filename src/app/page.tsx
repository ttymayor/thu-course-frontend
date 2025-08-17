import CourseScheduleList from "@/components/CourseScheduleList";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-4 sm:py-8 px-4 sm:px-6">
        <main className="flex flex-col gap-8 sm:gap-[32px] items-center justify-center">
          <div id="schedule" className="w-full flex justify-center">
            <CourseScheduleList />
          </div>
        </main>
      </div>
    </div>
  );
}
