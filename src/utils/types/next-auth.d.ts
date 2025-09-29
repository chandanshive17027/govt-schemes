import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      role?: string;
      image?: string | null;
      plan: string;
    };
  }

  interface User {
    id: string;
    role?: string;
    email: string;
    name?: string | null;
    image?: string | null;
  }

  interface JWT {
    id: string;
    role?: string;
  }
}