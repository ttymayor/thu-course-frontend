import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Profile from "@/components/Profile";
import BaseLayout from "@/components/BaseLayout";

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

export default async function ProfilePage() {
  const session = await getSession();

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <BaseLayout>
      <Profile session={session} />
    </BaseLayout>
  );
}
