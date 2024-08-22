// types/next-auth.d.ts

import { DefaultSession, DefaultUser } from "next-auth";
import { JWT as NextAuthJWT } from "next-auth/jwt";

// Extend the default User type
declare module "next-auth" {
    interface User extends DefaultUser {
        id: string;
        name: string;
        email: string;
        username: string;
        isAdmin?: boolean; // Add isAdmin to User type
    }

    interface Session {
        user: {
            id: string;
            name: string;
            email: string;
            username: string;
            isAdmin?: boolean; // Add isAdmin to Session user type
        } & DefaultSession["user"];
    }
}

// Extend JWT type
declare module "next-auth/jwt" {
    interface JWT extends NextAuthJWT {
        id: string;
        name: string;
        email: string;
        username: string;
        isAdmin?: boolean; // Add isAdmin to JWT type
    }
}
