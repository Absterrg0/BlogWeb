import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import client from '@/db'; // Ensure this path is correct
import bcrypt from 'bcrypt';

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
            
                    const user = await client.user.findFirst({
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
            
                    return {
                        id: user.id.toString(),
                        name: user.name,
                        email: user.email,
                        username: user.username
                    };
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
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user = {
                    id: token.id as string,
                    name: token.firstname as string,
                    email: token.lastname as string,
                    username: token.username as string
                };
            }
            return session;
        }
    }
};

export default authValues;
