import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import prisma from "@zestify/db";
import crypto from "crypto";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "mock_google_id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "mock_google_secret",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            include: { profile: true }
          });

          if (!user || !user.passwordHash) return null;

          // Verify password hash (SHA-256)
          const inputHash = crypto.createHash('sha256').update(credentials.password).digest('hex');
          if (user.passwordHash !== inputHash) return null;

          // Check user status
          if (user.status !== 'ACTIVE') return null;

          // Update last login timestamp
          await prisma.user.update({
            where: { id: user.id },
            data: { updatedAt: new Date() }
          });

          return {
            id: user.id,
            email: user.email,
            name: user.profile
              ? `${user.profile.firstName || ''} ${user.profile.lastName || ''}`.trim()
              : user.email,
            role: "user"
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role || "user";
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    newUser: '/signup'
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback_mock_secret_do_not_use_in_prod",
  debug: process.env.NODE_ENV === 'development',
};
