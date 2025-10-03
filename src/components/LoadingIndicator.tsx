"use client";

import { useLinkStatus } from "next/link";
import { Spinner } from "@/components/ui/spinner";

export default function LoadingIndicator() {
  const { pending } = useLinkStatus();
  return pending ? (
    <div role="status" aria-label="Loading" className="inline-block">
      <Spinner />
    </div>
  ) : null;
}
