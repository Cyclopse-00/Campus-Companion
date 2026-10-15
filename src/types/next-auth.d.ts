import type { DefaultSession, DefaultUser } from "next-auth";
import type { DefaultJWT } from "next-auth/jwt";
import type { UserRole } from "@prisma/client";

/**
 * Extend NextAuth session types to include CampusHub-specific user fields.
 * Import this file in tsconfig paths or add a triple-slash reference.
 */

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      rollNumber: string | null;
      department: string | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: UserRole;
    rollNumber?: string | null;
    department?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role: UserRole;
    rollNumber?: string | null;
    department?: string | null;
  }
}
