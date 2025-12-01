import NextAuth, { type AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // 限制特定網域
      const allowedDomains = ["thu.edu.tw", "go.thu.edu.tw"];
      const emailDomain = user.email?.split("@")[1];
      if (emailDomain && allowedDomains.includes(emailDomain)) {
        return true;
      }
      return false; // 拒絕登入
    },
    async session({ session }) {
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin", // 自訂登入頁面
    error: "/auth/error", // 錯誤頁面
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
