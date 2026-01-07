"use cache";
import connectMongoDB from "@/lib/mongodb";
import { Department as DepartmentModel } from "@/models/Department";
import { Department } from "@/types/department";

export async function getDepartments(): Promise<{
  data: Department[];
}> {
  await connectMongoDB();
  const departments = await DepartmentModel.find().lean();

  const data = departments.map((dept) => ({
    ...dept,
    _id: dept._id.toString(),
  }));

  return { data };
}
