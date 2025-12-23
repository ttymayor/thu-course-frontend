import { User, UserDocument } from "@/models/user";
import connectMongoDB from "@/lib/mongodb";
import { UpdateQuery } from "mongoose";

/**
 * 根據 email 查找或創建用戶
 */
export async function findOrCreateUser({
  email,
  name,
  image,
}: {
  email: string;
  name?: string | null;
  image?: string | null;
}) {
  await connectMongoDB();

  // update fields
  const updateUser: UpdateQuery<UserDocument> = {};
  if (name) updateUser.name = name;
  if (image) updateUser.image = image;

  const user = await User.findOneAndUpdate({ email }, updateUser, {
    upsert: true,
    new: true,
    runValidators: true,
  });

  return user;
}

/**
 * 根據 email 查找用戶
 */
export async function findUserByEmail(email: string) {
  if (!email) return null;
  await connectMongoDB();
  return await User.findOne({ email }).lean();
}
