"use client";

import { signIn } from "next-auth/react";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import SignIn from "@/components/SignIn";
import { toast } from "sonner";

export default function SignInPage() {
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
