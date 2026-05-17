import { User, UserDocument } from "@/models/User";
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
    returnDocument: "after",
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

export async function getBookmarks(email: string): Promise<string[]> {
  await connectMongoDB();
  const user = await User.findOne({ email }, { bookmarks: 1 }).lean();
  return (user as UserDocument | null)?.bookmarks ?? [];
}

export async function addBookmark(email: string, courseCode: string): Promise<string[]> {
  await connectMongoDB();
  const user = await User.findOneAndUpdate(
    { email },
    { $addToSet: { bookmarks: courseCode } },
    { returnDocument: "after", projection: { bookmarks: 1 } },
  ).lean();
  return (user as UserDocument | null)?.bookmarks ?? [];
}

export async function removeBookmark(email: string, courseCode: string): Promise<string[]> {
  await connectMongoDB();
  const user = await User.findOneAndUpdate(
    { email },
    { $pull: { bookmarks: courseCode } },
    { returnDocument: "after", projection: { bookmarks: 1 } },
  ).lean();
  return (user as UserDocument | null)?.bookmarks ?? [];
}

export async function getSchedule(email: string): Promise<string[]> {
  await connectMongoDB();
  const user = await User.findOne({ email }, { schedule: 1 }).lean();
  return (user as UserDocument | null)?.schedule ?? [];
}

export async function saveSchedule(email: string, courseCodes: string[]): Promise<string[]> {
  await connectMongoDB();
  const user = await User.findOneAndUpdate(
    { email },
    { $set: { schedule: courseCodes } },
    { returnDocument: "after", projection: { schedule: 1 } },
  ).lean();
  return (user as UserDocument | null)?.schedule ?? [];
}
