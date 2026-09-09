import { redirect } from "next/navigation";
import { connection } from "next/server";
import FeedbackForm from "@/components/FeedbackForm";
import BaseLayout from "@/components/BaseLayout";
import { getSession } from "@/lib/auth";

export default async function FeedbackPage() {
  await connection();

  const session = await getSession();

  if (!session) {
    redirect("/auth/signin?callbackUrl=/feedback");
  }

  return (
    <BaseLayout>
      <FeedbackForm />
    </BaseLayout>
  );
}
