"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Signin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);  // State for handling errors
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();  // Prevent default form submission behavior

        // Sign in using NextAuth's signIn function
        const result = await signIn('credentials', {
            redirect: false,  // Prevent automatic redirection
            username,
            password,
        });

        if (result?.ok) {
            // Redirect to home page upon successful sign-in
            router.push('/');
        } else {
            // Handle sign-in error
            setError(result?.error || "An unexpected error occurred");
        }
    };

    return (
        <div className="bg-slate-400 items-center min-h-screen flex justify-center">
            <div className="border rounded-md p-5 m-3 bg-slate-200">
                <h1 className="flex justify-center font-bold text-4xl pb-3">Sign In</h1>
                <h2 className="text-gray-500 pb-7">Log in to your account to access features</h2>

                <form onSubmit={handleSubmit}>  {/* Form element to handle submission */}
                    <div className="p-2 text-l">
                        Username:
                    </div>
                    <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        type="text"
                        className="w-full p-2"
                        placeholder="Username"
                        required
                    />
                    <div className="text-l p-2">
                        Password:
                    </div>
                    <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        className="p-2 w-full"
                        placeholder="Password"
                        required
                    />
                    {error && (
                        <div className="bg-red-500 text-white p-2 rounded-md mt-2">
                            {error}
                        </div>
                    )}
                    <button
                        type="submit"  // Ensure button type is submit
                        className="flex justify-center bg-black text-white items-center p-3 w-full rounded-lg mt-7"
                    >
                        Sign In
                    </button>
                </form>

                <div className="p-3 flex justify-around">
                    <div className="text-gray-700">
                     Don&#39;t have an account?

                    </div>
                    <button
                        onClick={() => router.push('/api/auth/signup')}
                        className="underline cursor-pointer text-blue-600"
                    >
                        Sign Up
                    </button>
                </div>
            </div>
        </div>
    );
}
