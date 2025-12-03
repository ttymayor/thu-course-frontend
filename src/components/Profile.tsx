"use client";

import { type Session } from "next-auth";
import Image from "next/image";

export default function Profile({ session }: { session: Session }) {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">個人資料</h1>
      </div>
      <div className="space-y-4">
        <div className="flex items-center gap-4 rounded-lg border p-4">
          {session.user?.image && (
            <div className="shrink-0">
              <Image
                src={session.user.image}
                alt="用戶頭像"
                width={80}
                height={80}
                className="h-20 w-20 rounded-full"
              />
            </div>
          )}
          <div>
            <p className="text-muted-foreground">
              <strong>名稱：</strong>
              {session.user?.name || "未設定"}
            </p>
            <p className="text-muted-foreground">
              <strong>電子郵件：</strong>
              {session.user?.email || "未設定"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
