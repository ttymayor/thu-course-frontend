import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Profile from "@/components/Profile";

export default async function ProfilePage() {
  const session = await getSession();

  if (!session) {
    redirect("/auth/signin");
  }

  return <Profile session={session} />;
}
