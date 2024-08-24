// auth.ts or your NextAuth configuration file
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import client from '@/db'; // Ensure this path is correct
import bcrypt from 'bcrypt';

// Define the User type based on your Prisma schema
interface User {
    id: string;
    name: string;
    email: string;
    username: string;
    role: "ADMIN" | "USER";
}

export const authValues: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: 'Username', type: 'text', placeholder: 'Enter Username' },
                password: { label: 'Password', type: 'password', placeholder: 'Enter Password' }
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) {
                    throw new Error("Missing username or password");
                }
            
                try {
                    console.log("Attempting to find user with username:", credentials.username);
            
                    const user = await client.user.findUnique({
                        where: {
                            username: credentials.username
                        }
                    });
            
                    console.log("User found:", user);
            
                    if (!user) {
                        throw new Error("No user found with this username");
                    }
            
                    const isValidPassword = await bcrypt.compare(credentials.password, user.password);
                    if (!isValidPassword) {
                        throw new Error("Invalid Password");
                    }
            
                    // Return user object that matches the Prisma User model
                    return {
                        id: user.id.toString(),
                        name: user.name,
                        email: user.email,
                        username: user.username,
                        role: user.role // Ensure this matches your schema
                    } as User;
                } catch (e) {
                    console.error(e);
                    throw new Error("An error occurred during authorization");
                }
            }
        })
    ],
    pages: {
        signIn: '/auth/signin' // Path to the custom sign-in page
    },
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: 'jwt'
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;
                token.username = user.username;
                token.role = user.role; // Include role as defined in types
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user = {
                    id: token.id as string,
                    name: token.name as string,
                    email: token.email as string,
                    username: token.username as string,
                    role: token.role as "ADMIN" | "USER" // Ensure this matches the JWT structure
                };
            }
            return session;
        }
    }
};

export default authValues;
