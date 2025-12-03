import NextAuth, { type AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { findOrCreateUser } from "@/lib/user";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      const allowedDomains = ["thu.edu.tw", "go.thu.edu.tw"];
      const emailDomain = user.email?.split("@")[1];
      if (emailDomain && allowedDomains.includes(emailDomain)) {
        // 手動將用戶寫入 MongoDB
        if (user.email) {
          try {
            await findOrCreateUser({
              email: user.email,
              name: user.name || null,
              image: user.image || null,
            });
          } catch (error) {
            console.error("Error saving user to MongoDB:", error);
            // 即使寫入失敗也允許登入，避免影響用戶體驗
          }
        }
        return true;
      }
      return false;
    },
    async session({ session }) {
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
