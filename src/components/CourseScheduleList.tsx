"use cache";

import { getCourseSchedules } from "@/lib/courseSchedule";
import CourseScheduleTable from "@/components/CourseScheduleTable";

export default async function CourseScheduleList() {
  const schedules = await getCourseSchedules();
  const plain = schedules.map((s) => ({
    _id: String(s._id),
    course_stage: s.course_stage ?? "",
    start_time: s.start_time ?? "",
    end_time: s.end_time ?? "",
    result_publish_time: String(s.result_publish_time ?? ""),
  }));
  return <CourseScheduleTable schedules={plain} />;
}
