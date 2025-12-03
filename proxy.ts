import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  },
);

export const config = {
  matcher: [
    "/profile/:path*",
    // 可以在這裡添加其他需要保護的路由
    // 注意：不要包含 /api/auth 路由，因為 NextAuth 需要處理這些路由
  ],
};
