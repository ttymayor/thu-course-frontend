import CourseListSkeleton from "@/components/schedule-simulator/CourseListSkeleton";
import ScheduleTable from "@/components/schedule-simulator/ScheduleTable";

export default function ScheduleSimulatorSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <CourseListSkeleton />
      <ScheduleTable selectedCourses={[]} />
    </div>
  );
}
