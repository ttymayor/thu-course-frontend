import { User, UserDocument, TermCourseCodes } from "@/models/User";
import connectMongoDB from "@/lib/mongodb";
import { UpdateQuery } from "mongoose";
import {
  CourseTerm,
  getConfiguredCourseTerm,
  isSameTerm,
} from "@/lib/courseIdentity";

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

  const setFields: Partial<Pick<UserDocument, "name" | "image">> = {};
  if (name) setFields.name = name;
  if (image) setFields.image = image;

  await User.updateOne({ email }, [
    {
      $set: {
        bookmarks: { $ifNull: ["$bookmarks", []] },
        schedule: { $ifNull: ["$schedule", []] },
        bookmark_terms: { $ifNull: ["$bookmark_terms", []] },
        schedules: { $ifNull: ["$schedules", []] },
      },
    },
  ]);

  const updateUser: UpdateQuery<UserDocument> = {
    $setOnInsert: {
      bookmarks: [],
      schedule: [],
      bookmark_terms: [],
      schedules: [],
    },
  };
  if (Object.keys(setFields).length > 0) updateUser.$set = setFields;

  const user = await User.findOneAndUpdate({ email }, updateUser, {
    upsert: true,
    returnDocument: "after",
    runValidators: true,
    setDefaultsOnInsert: true,
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

const legacyTerm = getConfiguredCourseTerm();
const termUpdateRetryLimit = 5;

function getLegacyCodesForTerm(
  legacyCodes: string[] | undefined,
  term: CourseTerm,
) {
  return legacyTerm && isSameTerm(term, legacyTerm) ? legacyCodes : undefined;
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

  return (
    termEntry?.course_codes ?? getLegacyCodesForTerm(legacyCodes, term) ?? []
  );
}

async function updateTermCodes(
  email: string,
  field: "bookmark_terms" | "schedules",
  term: CourseTerm,
  update: (courseCodes: string[]) => string[],
) {
  await connectMongoDB();
  const user = (await User.findOne({ email }).lean()) as UserDocument | null;
  const entries = [...((user?.[field] ?? []) as TermCourseCodes[])];
  const legacyCodes =
    field === "bookmark_terms" ? user?.bookmarks : user?.schedule;
  const index = entries.findIndex(
    (entry) =>
      entry.academic_year === term.academic_year &&
      entry.academic_semester === term.academic_semester,
  );
  const currentCodes =
    index >= 0
      ? entries[index].course_codes
      : (getLegacyCodesForTerm(legacyCodes, term) ?? []);
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

async function updateBookmarkTermCodes(
  email: string,
  term: CourseTerm,
  update: (courseCodes: string[]) => string[],
) {
  await connectMongoDB();

  for (let attempt = 0; attempt < termUpdateRetryLimit; attempt += 1) {
    const user = (await User.findOne(
      { email },
      { bookmarks: 1, bookmark_terms: 1 },
    ).lean()) as UserDocument | null;

    if (!user) {
      await User.updateOne(
        { email },
        {
          $setOnInsert: {
            bookmarks: [],
            schedule: [],
            bookmark_terms: [],
            schedules: [],
          },
        },
        { upsert: true },
      );
      continue;
    }

    const previousEntries = [
      ...((user.bookmark_terms ?? []) as TermCourseCodes[]),
    ];
    const entries = previousEntries.map((entry) => ({
      academic_year: entry.academic_year,
      academic_semester: entry.academic_semester,
      course_codes: [...(entry.course_codes ?? [])],
    }));
    const index = entries.findIndex(
      (entry) =>
        entry.academic_year === term.academic_year &&
        entry.academic_semester === term.academic_semester,
    );
    const currentCodes =
      index >= 0
        ? entries[index].course_codes
        : (getLegacyCodesForTerm(user.bookmarks, term) ?? []);
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

    const filter =
      previousEntries.length > 0
        ? { email, bookmark_terms: previousEntries }
        : {
            email,
            $or: [
              { bookmark_terms: previousEntries },
              { bookmark_terms: { $exists: false } },
            ],
          };
    const result = await User.updateOne(filter, {
      $set: { bookmark_terms: entries },
    });

    if (result.matchedCount > 0) return nextCodes;
  }

  throw new Error("Could not update bookmark_terms after concurrent changes");
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

export async function getBookmarkTerms(
  email: string,
): Promise<TermCourseCodes[]> {
  await connectMongoDB();
  const user = (await User.findOne(
    { email },
    { bookmarks: 1, bookmark_terms: 1 },
  ).lean()) as UserDocument | null;
  const bookmarkTerms = (user?.bookmark_terms ?? []) as TermCourseCodes[];

  const entries = bookmarkTerms
    .map((entry) => ({
      academic_year: entry.academic_year,
      academic_semester: entry.academic_semester,
      course_codes: Array.from(new Set(entry.course_codes ?? [])),
    }))
    .filter((entry) => entry.course_codes.length > 0);

  if (
    legacyTerm &&
    (user?.bookmarks?.length ?? 0) > 0 &&
    !bookmarkTerms.some((entry) => isSameTerm(entry, legacyTerm))
  ) {
    entries.push({
      academic_year: legacyTerm.academic_year,
      academic_semester: legacyTerm.academic_semester,
      course_codes: Array.from(new Set(user?.bookmarks ?? [])),
    });
  }

  return entries.sort(
    (a, b) =>
      b.academic_year - a.academic_year ||
      b.academic_semester - a.academic_semester,
  );
}

export async function addBookmarkForTerm(
  email: string,
  term: CourseTerm,
  courseCode: string,
): Promise<string[]> {
  return updateBookmarkTermCodes(email, term, (courseCodes) => [
    ...courseCodes,
    courseCode,
  ]);
}

export async function removeBookmarkForTerm(
  email: string,
  term: CourseTerm,
  courseCode: string,
): Promise<string[]> {
  return updateBookmarkTermCodes(email, term, (courseCodes) =>
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
