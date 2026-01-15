import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import FeedbackForm from "@/components/FeedbackForm";

export default async function FeedbackPage() {
  const session = await getSession();

  if (!session) {
    redirect("/auth/signin?callbackUrl=/feedback");
  }

  return (
    <div className="container mx-auto flex items-center justify-center px-4 py-10">
      <FeedbackForm />
    </div>
  );
}
