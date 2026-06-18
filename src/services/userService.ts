import { User, UserDocument, TermCourseCodes } from "@/models/User";
import connectMongoDB from "@/lib/mongodb";
import { UpdateQuery } from "mongoose";
import { CourseTerm } from "@/lib/courseIdentity";

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

function getTermCodes(
  entries: TermCourseCodes[] | undefined,
  legacyCodes: string[] | undefined,
  term: CourseTerm,
) {
  const termEntry = entries?.find(
    (entry) =>
      entry.academic_year === term.academic_year &&
      entry.academic_semester === term.academic_semester,
  );

  return termEntry?.course_codes ?? legacyCodes ?? [];
}

async function updateTermCodes(
  email: string,
  field: "bookmark_terms" | "schedules",
  term: CourseTerm,
  update: (courseCodes: string[]) => string[],
) {
  await connectMongoDB();
  const user = await User.findOne({ email }).lean();
  const entries = [
    ...(((user as UserDocument | null)?.[field] ?? []) as TermCourseCodes[]),
  ];
  const index = entries.findIndex(
    (entry) =>
      entry.academic_year === term.academic_year &&
      entry.academic_semester === term.academic_semester,
  );
  const currentCodes = index >= 0 ? entries[index].course_codes : [];
  const nextCodes = Array.from(new Set(update(currentCodes)));

  if (index >= 0) {
    entries[index] = { ...entries[index], course_codes: nextCodes };
  } else {
    entries.push({
      academic_year: term.academic_year,
      academic_semester: term.academic_semester,
      course_codes: nextCodes,
    });
  }

  await User.updateOne({ email }, { $set: { [field]: entries } });
  return nextCodes;
}

export async function getBookmarksForTerm(
  email: string,
  term: CourseTerm,
): Promise<string[]> {
  await connectMongoDB();
  const user = await User.findOne(
    { email },
    { bookmarks: 1, bookmark_terms: 1 },
  ).lean();
  return getTermCodes(
    (user as UserDocument | null)?.bookmark_terms,
    (user as UserDocument | null)?.bookmarks,
    term,
  );
}

export async function addBookmarkForTerm(
  email: string,
  term: CourseTerm,
  courseCode: string,
): Promise<string[]> {
  return updateTermCodes(email, "bookmark_terms", term, (courseCodes) => [
    ...courseCodes,
    courseCode,
  ]);
}

export async function removeBookmarkForTerm(
  email: string,
  term: CourseTerm,
  courseCode: string,
): Promise<string[]> {
  return updateTermCodes(email, "bookmark_terms", term, (courseCodes) =>
    courseCodes.filter((code) => code !== courseCode),
  );
}

export async function addBookmark(
  email: string,
  courseCode: string,
): Promise<string[]> {
  await connectMongoDB();
  const user = await User.findOneAndUpdate(
    { email },
    { $addToSet: { bookmarks: courseCode } },
    { returnDocument: "after", projection: { bookmarks: 1 } },
  ).lean();
  return (user as UserDocument | null)?.bookmarks ?? [];
}

export async function removeBookmark(
  email: string,
  courseCode: string,
): Promise<string[]> {
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

export async function getScheduleForTerm(
  email: string,
  term: CourseTerm,
): Promise<string[]> {
  await connectMongoDB();
  const user = await User.findOne(
    { email },
    { schedule: 1, schedules: 1 },
  ).lean();
  return getTermCodes(
    (user as UserDocument | null)?.schedules,
    (user as UserDocument | null)?.schedule,
    term,
  );
}

export async function saveSchedule(
  email: string,
  courseCodes: string[],
): Promise<string[]> {
  await connectMongoDB();
  const user = await User.findOneAndUpdate(
    { email },
    { $set: { schedule: courseCodes } },
    { returnDocument: "after", projection: { schedule: 1 } },
  ).lean();
  return (user as UserDocument | null)?.schedule ?? [];
}

export async function saveScheduleForTerm(
  email: string,
  term: CourseTerm,
  courseCodes: string[],
): Promise<string[]> {
  return updateTermCodes(email, "schedules", term, () => courseCodes);
}
