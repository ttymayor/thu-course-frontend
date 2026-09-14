"use cache";

import connectMongoDB from "@/lib/mongodb";
import { CourseScheduleModel } from "@/models/CourseSchedule";
import type { CourseSchedule } from "@/types/courseSchedule";

function getResultPublishTime(resultPublishTime: unknown) {
  const values = Array.isArray(resultPublishTime)
    ? resultPublishTime
    : [resultPublishTime];
  return (
    values.find(
      (value): value is string =>
        typeof value === "string" && value.trim().length > 0,
    ) ?? ""
  );
}

export async function getCourseSchedules(): Promise<CourseSchedule[]> {
  await connectMongoDB();
  const schedules = await CourseScheduleModel.find({})
    .select("_id course_stage start_time end_time result_publish_time")
    .lean();

  return schedules.map((schedule) => ({
    _id: schedule._id.toString(),
    course_stage: schedule.course_stage ?? "",
    start_time: schedule.start_time ?? "",
    end_time: schedule.end_time ?? "",
    result_publish_time: getResultPublishTime(schedule.result_publish_time),
  }));
}
