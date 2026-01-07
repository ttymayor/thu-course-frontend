import { ReactNode } from "react";
import type { Metadata } from "next";
import { getCourseByCode } from "@/services/courseService";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ courseCode: string }>;
}): Promise<Metadata> {
  const { courseCode } = await params;
  const courseInfo = await getCourseByCode(courseCode);

  const baseUrl = "https://thc.ttymayor.com";
  const ogImageUrl = `${baseUrl}/api/og/course-info/${encodeURIComponent(
    courseCode
  )}`;

  if (!courseInfo) {
    return {
      metadataBase: new URL(baseUrl),
      title: `${courseCode}`,
      description: "東海大學課程資訊查詢",
      openGraph: {
        title: `${courseCode} - 東海課程資訊`,
        description: "東海大學課程資訊查詢",
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: `${courseCode} - 東海課程資訊`,
          },
        ],
        type: "website",
        url: `${baseUrl}/course-info/${courseCode}`,
        siteName: "東海課程資訊",
        locale: "zh-TW",
      },
      twitter: {
        card: "summary_large_image",
        title: `${courseCode} - 東海課程資訊`,
        description: "東海大學課程資訊查詢",
        site: "@thc_ttymayor",
        creator: "@thc_ttymayor",
        images: [
          {
            url: ogImageUrl,
            alt: `${courseCode} - 東海課程資訊`,
          },
        ],
      },
    };
  }

  const title = `${courseCode} ${courseInfo.course_name}`;
  const description =
    courseInfo.course_description ||
    `${courseInfo.course_name} - ${courseInfo.department_name}，${courseInfo.credits_1}學分`;

  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: "website",
      url: `${baseUrl}/course-info/${courseCode}`,
      siteName: "東海課程資訊",
      locale: "zh-TW",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: "@thc_ttymayor",
      creator: "@thc_ttymayor",
      images: [
        {
          url: ogImageUrl,
          alt: title,
        },
      ],
    },
  };
}

export default function CourseInfoLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <div>{children}</div>;
}
