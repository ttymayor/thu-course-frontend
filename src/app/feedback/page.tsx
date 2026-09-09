import { redirect } from "next/navigation";
import FeedbackForm from "@/components/FeedbackForm";
import BaseLayout from "@/components/BaseLayout";
import { getSession } from "@/lib/auth";

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

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
