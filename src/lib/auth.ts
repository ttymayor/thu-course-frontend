import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/**
 * 獲取當前用戶的 session（用於 Server Components）
 */
export async function getSession() {
  return await getServerSession(authOptions);
}

/**
 * 要求用戶必須已登入，否則拋出錯誤
 */
export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    throw new Error("未授權：請先登入");
  }
  return session;
}
