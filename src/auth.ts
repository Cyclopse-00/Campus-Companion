import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import type { UserRole } from "@prisma/client";
import { z } from "zod";

// ---------------------------------------------------------------------------
// Domain Validation Helper
// ---------------------------------------------------------------------------
const ALLOWED_DOMAIN = process.env.NEXT_PUBLIC_ALLOWED_EMAIL_DOMAIN ?? "@campus.edu";

function isAllowedEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  return email.toLowerCase().endsWith(ALLOWED_DOMAIN.toLowerCase());
}

// ---------------------------------------------------------------------------
// Credentials Schema (email + password or roll number login)
// ---------------------------------------------------------------------------
const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// ---------------------------------------------------------------------------
// Auth.js v5 Configuration
// ---------------------------------------------------------------------------
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),

  session: {
    strategy: "jwt", // Use JWT for edge compatibility
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  pages: {
    signIn: "/auth/sign-in",
    error: "/auth/error",
    verifyRequest: "/auth/verify",
  },

  providers: [
    // Google Workspace / Institutional SSO
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),

    // Microsoft Entra ID / Azure AD SSO
    MicrosoftEntraID({
      clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID!,
      clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET!,
      issuer: process.env.AUTH_MICROSOFT_ENTRA_ID_ISSUER!,
      allowDangerousEmailAccountLinking: true,
    }),

    // Email + Password credentials (for campuses without SSO)
    Credentials({
      name: "Email & Password",
      credentials: {
        email: { label: "College Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        if (!isAllowedEmail(email)) return null;

        const user = await db.user.findUnique({ where: { email } });
        if (!user || !user.password) return null;

        // NOTE: Replace with bcrypt.compare in production
        const { compare } = await import("bcryptjs");
        const isValid = await compare(password, user.password);
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
          rollNumber: user.rollNumber,
          department: user.department,
        };
      },
    }),
  ],

  callbacks: {
    // Block OAuth sign-ins from non-campus email domains
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") {
        if (!isAllowedEmail(user.email)) {
          return `/auth/error?error=DomainNotAllowed&domain=${ALLOWED_DOMAIN}`;
        }
      }
      return true;
    },

    async jwt({ token, user, trigger, session }) {
      // Initial sign-in: attach user fields to token
      if (user) {
        if (user.id) token.id = user.id;
        token.role = (user as any).role as UserRole;
        token.rollNumber = (user as any).rollNumber as string | null;
        token.department = (user as any).department as string | null;
      }

      // Session update: refresh token from DB
      if (trigger === "update" && session) {
        const dbUser = await db.user.findUnique({
          where: { id: token.id as string },
          select: { role: true, name: true, image: true, department: true, rollNumber: true },
        });
        if (dbUser) {
          token.role = dbUser.role;
          token.name = dbUser.name;
          token.picture = dbUser.image;
          token.department = dbUser.department;
          token.rollNumber = dbUser.rollNumber;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
        session.user.rollNumber = token.rollNumber as string | null;
        session.user.department = token.department as string | null;
      }
      return session;
    },
  },

  events: {
    // Auto-create profile on first OAuth sign-in
    async createUser({ user }) {
      if (user.email) {
        await db.user.update({
          where: { id: user.id },
          data: {
            role: "STUDENT", // default role; admin promotes manually
          },
        });
      }
    },
  },
});
