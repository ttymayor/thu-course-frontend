"use client";

import { useLinkStatus } from "next/link";
import { Loader } from "lucide-react";

export default function LoadingIndicator() {
  const { pending } = useLinkStatus();
  return pending ? (
    <div role="status" aria-label="Loading" className="inline-block">
      <Loader className="w-4 h-4 animate-spin" />
    </div>
  ) : null;
}
