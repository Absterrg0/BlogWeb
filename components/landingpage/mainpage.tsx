"use client";
import { useRouter } from 'next/navigation';

export default function LandingPage() {
    const router = useRouter();

    const handleSignUp = () => {
        router.push('/api/auth/signup');
    };

    return (
        <div className="relative min-h-screen flex flex-col bg-gray-900 text-gray-200 pt-16">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-60"></div>
            </div>

            <main className="relative flex-grow flex flex-col items-center justify-center text-center p-8">
                <div className="max-w-2xl mx-auto relative z-10">
                    <h1 className="text-5xl font-bold mb-6 text-white leading-tight">
                        Welcome to MyBlogSite
                    </h1>
                    <p className="text-lg mb-8 text-gray-300">
                        Discover and share your passion for writing and blogging. Connect with a community of like-minded individuals and express your creativity. 
                        Whether you are a seasoned writer or just getting started, MyBlogSite is the perfect place to share your voice.
                    </p>
                    <button
                        onClick={handleSignUp}
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8 py-4 rounded-md text-lg font-semibold shadow-lg transform transition-transform hover:scale-105"
                    >
                        Get Started
                    </button>
                </div>
            </main>
            <footer className="bg-gray-800 p-4 text-center">
                <p className="text-gray-400">© 2024 MyBlogSite. All rights reserved.</p>
            </footer>
        </div>
    );
}
