// src/lib/auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";

async function getPrisma() {
  const { prisma } = await import("@/lib/prisma");
  return prisma;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,

  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const prisma = await getPrisma();
        const bcrypt = (await import("bcryptjs")).default;

        const identifier = (credentials.email as string).trim().toLowerCase();

        const user = await prisma.user.findFirst({
          where: {
            OR: [{ email: identifier }, { phone: identifier }],
          },
        });

        if (!user || !user.passwordHash) return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        );

        if (!isValid) return null;
        if (user.status !== "ACTIVE") return null;
        if (user.role !== "ADMIN") return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  // 🔑 این بخش چیزیه که کم بود
  callbacks: {
    ...authConfig.callbacks, // اگه authConfig callback داره، حفظش کن

    async jwt({ token, user }) {
      // فقط بار اول که user هست (بلافاصله بعد از authorize موفق)
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
});