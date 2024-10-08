"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from 'react';

export default function AppBar() {
    const { data: session } = useSession();
    const router = useRouter();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleSignIn = () => {
        signIn();
    };

    const handleSignUp = () => {
        router.push('/api/auth/signup');
    };

    const handleSignOut = () => {
        signOut();
    };

    const handleGoToBlogs = () => {
        router.push('/blogs');
    };

    const handleAccountSettings = () => {
        if (session && session.user?.id) {
            router.push(`/accounts/${session.user.id}`);
        } else {
            alert('Unable to find user ID. Please try again later.');
        }
    };

    const handleYourBlogs = () => {
        if (session && session.user?.id) {
            router.push(`/users/${session.user.id}`);
        } else {
            alert('Unable to find user ID. Please try again later.');
        }
    };


    return (
        <div className="bg-slate-900 text-slate-200 z-50 fixed w-full top-0 left-0">
            <div className="flex justify-between items-center p-4">
                {/* Logo */}
                <div className="text-2xl font-bold">
                    BlogMaster
                </div>

                {/* Search Form */}
                <form className="relative flex-grow max-w-lg">   
                    <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                    <div className="relative flex">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                            </svg>
                        </div>
                        <input 
                            type="search" 
                            id="default-search" 
                            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                            placeholder="Search Mockups, Logos..." 
                            required 
                        />
                        <button 
                            type="submit" 
                            className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            aria-label="Search"
                        >
                            Search
                        </button>
                    </div>
                </form>

                {/* Navigation Buttons */}
                <div className="flex items-center space-x-4">
                    <button 
                        type="button" 
                        onClick={handleGoToBlogs}
                        aria-label="Go to Blogs"
                        className="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-lg text-sm px-5 py-3 text-center mb-1.5"
                    >
                        Blogs
                    </button>
                    {session ? (
                        <div className="relative">
                            <button 
                                className="text-xl font-semibold"
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                            >
                                Hello, {session.user?.username || 'User'}
                            </button>
                            {dropdownOpen && (
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white text-gray-900 rounded-lg shadow-lg z-50">
                                    <button
                                        onClick={handleSignOut}
                                        className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                        aria-label="Sign Out"
                                    >
                                        Sign Out
                                    </button>
                                    <button
                                        onClick={handleAccountSettings}
                                        className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                        aria-label="Account Settings"
                                    >
                                        Account Settings
                                    </button>
                                    <button
                                        onClick={handleYourBlogs}
                                        className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                        aria-label="Your Blogs"
                                    >
                                        Your Blogs
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex space-x-4">
                            <button 
                                onClick={handleSignIn}
                                aria-label="Sign In"
                                className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800"
                            >
                                <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                                    Sign In
                                </span>
                            </button>
                            <button 
                                onClick={handleSignUp}
                                aria-label="Sign Up"
                                className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
                            >
                                <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                                    Sign Up
                                </span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
