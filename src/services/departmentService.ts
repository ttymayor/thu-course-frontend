import connectMongoDB from "@/lib/mongodb";
import { Department } from "@/models/Department";

export async function getDepartments() {
  await connectMongoDB();
  const department = await Department.find().lean();
  return department;
}
