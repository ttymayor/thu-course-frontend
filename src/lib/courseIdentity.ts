import { Course } from "@/types/course";

export interface CourseTerm {
  academic_year: number;
  academic_semester: number;
}

export function getTermKey(term: CourseTerm) {
  return `${term.academic_year}-${term.academic_semester}`;
}

export function getCourseKey(course: Course) {
  return `${course.academic_year}-${course.academic_semester}-${course.course_code}`;
}

export function getCourseQueryParams(term: CourseTerm) {
  return new URLSearchParams({
    academic_year: String(term.academic_year),
    academic_semester: String(term.academic_semester),
  });
}

export function parseCourseTerm(
  academicYearValue: unknown,
  academicSemesterValue: unknown,
): CourseTerm | null {
  if (
    academicYearValue === null ||
    academicYearValue === undefined ||
    academicYearValue === "" ||
    academicSemesterValue === null ||
    academicSemesterValue === undefined ||
    academicSemesterValue === ""
  ) {
    return null;
  }

  const academicYear = Number(academicYearValue);
  const academicSemester = Number(academicSemesterValue);

  if (!Number.isInteger(academicYear) || !Number.isInteger(academicSemester)) {
    return null;
  }

  return {
    academic_year: academicYear,
    academic_semester: academicSemester,
  };
}

export function parseTermParams(params: URLSearchParams): CourseTerm | null {
  return parseCourseTerm(
    params.get("year") ?? params.get("academic_year"),
    params.get("semester") ?? params.get("academic_semester"),
  );
}

export function getConfiguredCourseTerm(): CourseTerm | null {
  return parseCourseTerm(
    process.env.NEXT_PUBLIC_ACADEMIC_YEAR,
    process.env.NEXT_PUBLIC_ACADEMIC_SEMESTER,
  );
}

export function normalizeCourseTerm(term: CourseTerm): CourseTerm | null {
  return parseCourseTerm(term.academic_year, term.academic_semester);
}

export function dedupeCourseTerms(terms: CourseTerm[]) {
  const seen = new Set<string>();
  const deduped: CourseTerm[] = [];

  for (const rawTerm of terms) {
    const term = normalizeCourseTerm(rawTerm);
    if (!term) continue;

    const key = getTermKey(term);
    if (seen.has(key)) continue;

    seen.add(key);
    deduped.push(term);
  }

  return deduped;
}

export function isSameTerm(a: CourseTerm | null, b: CourseTerm | null) {
  return (
    !!a &&
    !!b &&
    a.academic_year === b.academic_year &&
    a.academic_semester === b.academic_semester
  );
}
