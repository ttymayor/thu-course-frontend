import CourseListSkeleton from "@/components/schedule-simulator/CourseListSkeleton";
import ScheduleCard from "@/components/schedule-simulator/ScheduleCard";
import Frame from "@/components/schedule-simulator/Frame";

export default function ScheduleSimulatorSkeleton() {
  return (
    <Frame>
      <div className="w-full min-w-0 md:w-1/3 md:pr-4">
        <CourseListSkeleton />
      </div>
      <div className="w-full min-w-0 md:w-2/3">
        <ScheduleCard selectedCourses={[]} session={null} />
      </div>
    </Frame>
  );
}
