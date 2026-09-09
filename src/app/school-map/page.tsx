"use cache";
import type { Metadata } from "next";
import SchoolMap from "@/components/school-map/SchoolMap";
import BaseLayout from "@/components/BaseLayout";

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

export const metadata: Metadata = {
  title: "校園地圖",
  description: "你會迷路嗎？來看看東海大學的校園地圖吧",
};

export default async function SchoolMapPage() {
  return (
    <BaseLayout>
      <SchoolMap />
    </BaseLayout>
  );
}
