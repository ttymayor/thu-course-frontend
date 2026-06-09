"use client";

import { signIn } from "next-auth/react";
import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SignIn from "@/components/SignIn";
import { toast } from "sonner";

function SignInContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const error = searchParams.get("error") || undefined;

  useEffect(() => {
    if (error) {
      toast.error("登入失敗，請稍後再試");
    }
  }, [error]);

  const handleSignIn = () => {
    signIn("google", { callbackUrl });
  };

  return <SignIn error={error || undefined} handleSignIn={handleSignIn} />;
}

export default function SignInPage() {
  return (
    <Suspense>
      <SignInContent />
    </Suspense>
  );
}
