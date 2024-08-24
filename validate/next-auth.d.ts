// next-auth.d.ts
import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      username: string;
      role: "ADMIN" | "USER"; // Ensure this matches your schema
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    name: string;
    email: string;
    username: string;
    role: "ADMIN" | "USER"; // Ensure this matches your schema
  }

  interface JWT {
    id: string;
    name: string;
    email: string;
    username: string;
    role: "ADMIN" | "USER"; // Ensure this matches your schema
  }
}
