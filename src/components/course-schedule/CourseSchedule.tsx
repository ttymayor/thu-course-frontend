import CourseScheduleStatus from "@/components/course-schedule/CourseScheduleStatus";
import { getCourseSchedules } from "@/services/courseScheduleService";

export default async function CourseSchedule() {
  const schedules = await getCourseSchedules();
  return <CourseScheduleStatus schedules={schedules} />;
}
