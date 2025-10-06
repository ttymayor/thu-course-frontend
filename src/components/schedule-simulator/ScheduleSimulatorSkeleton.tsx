import CourseListSkeleton from "@/components/schedule-simulator/CourseListSkeleton";
import ScheduleTable from "@/components/schedule-simulator/ScheduleTable";
import Frame from "@/components/schedule-simulator/Frame";

export default function ScheduleSimulatorSkeleton() {
  return (
    <Frame>
      <div className="md:w-1/3 w-full md:pr-4 min-w-0">
        <CourseListSkeleton />
      </div>
      <div className="md:w-2/3 w-full min-w-0">
        <ScheduleTable selectedCourses={[]} />
      </div>
    </Frame>
  );
}
