import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Profile from "@/components/Profile";
import BaseLayout from "@/components/BaseLayout";

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
