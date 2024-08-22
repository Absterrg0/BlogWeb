"use client"
import axios from 'axios'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AxiosError } from 'axios'

export default function Signup() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const router = useRouter()

    const handleAlready = () => {
        router.push('/api/auth/signin')
    }

    const handleSignup = async () => {
        setError("") // Reset error message
        try {
            const response = await axios.post("/api/auth", {
                name,
                email,
                username,
                password
            })
    
            if (response.status === 201) {
                router.push("/api/auth/signin?signup=success") // Redirect to sign-in page with query parameter
            }
        } catch (err) {
    if (err instanceof AxiosError) {  // Type guard
        if (err.response && err.response.data) {
            setError(err.response.data.error || "An error occurred");
        } else {
            setError("An unexpected error occurred");
        }
    } else {
        setError("An unexpected error occurred");
    }
}
    }
    return (
        <div className="bg-slate-400 items-center min-h-screen flex justify-center">
            <div className="border rounded-md p-5 m-3 bg-slate-200">
                <h1 className="flex justify-center font-bold text-4xl pb-3">Sign Up</h1>
                <h2 className="text-gray-500 pb-7">Create an account to access all the features</h2>
                
                {error && (
                    <div className="bg-red-600 text-white p-3 rounded-md mb-5">
                        <p className="font-semibold">Error:</p>
                        <p>{error}</p>
                    </div>
                )}

                <div>
                    <div className="p-2 text-l">
                        Name:
                    </div>
                    <input onChange={(e) => setName(e.target.value)} type="text" placeholder="Name" className="w-full p-2" />
                    <div className="p-2 text-l">
                        Email Id:
                    </div>
                    <input onChange={(e) => setEmail(e.target.value)} type="text" className="w-full p-2" placeholder="Email Address" />
                </div>
                <div className="p-2 text-l">
                    Username:
                </div>
                <input onChange={(e) => setUsername(e.target.value)} type="text" className="w-full p-2" placeholder="Username" />
                <div className="text-l p-2">
                    Password
                </div>
                <input onChange={(e) => setPassword(e.target.value)} type="password" className="p-2 w-full" placeholder="Password" />
                <button onClick={handleSignup} className="flex justify-center bg-black text-white items-center p-3 w-full rounded-lg mt-7">
                    Sign Up
                </button>
                <div className="p-3 flex justify-around">
                    <div className="text-gray-700">
                        Already have an account?
                    </div>
                    <button onClick={handleAlready} className="underline cursor-pointer text-blue-600">
                        Sign In
                    </button>
                </div>
            </div>
        </div>
    )
}
