import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import FeedbackForm from "@/components/FeedbackForm";
import BaseLayout from "@/components/BaseLayout";

export default async function FeedbackPage() {
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
