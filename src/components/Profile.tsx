"use client";

import { type Session } from "next-auth";
import Image from "next/image";
import { Card } from "./ui/card";

export default function Profile({ session }: { session: Session }) {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">個人資料</h1>
      </div>
      <Card className="flex flex-row items-center gap-4 rounded-lg border p-4">
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
        <div className="flex flex-col gap-2">
          <div>
            <p className="text-muted-foreground text-xs">名稱：</p>
            <p>{session.user?.name || "未設定"}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">電子郵件：</p>
            <p>{session.user?.email || "未設定"}</p>
          </div>
        </div>
      </Card>
    </>
  );
}
