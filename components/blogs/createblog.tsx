"use client";

import { useState } from "react";
import axios from 'axios';
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css"; // Import Quill's CSS

// Dynamically import Quill to prevent server-side rendering issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export default function CreateBlog() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [showEditor, setShowEditor] = useState(false);
    const { data: session } = useSession();

    const handleClick = async () => {
        if (!session?.user) {
            alert("You must be signed in to create a blog");
            return;
        }
        try {
            const res = await axios.post("/api/blogs", {
                title,
                content,
                userId: session.user.id
            });
            if (res.status === 200) {
                alert("Blog Added");
                setTitle("");
                setContent("");
                setShowEditor(false); // Hide editor after submission
            }
        } catch (e) {
            console.error(e);
            alert("Error adding blog");
        }
    };

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 mx-auto mb-8 max-w-4xl relative">
            <h2 className="text-4xl font-bold mb-6 text-gray-100">Create a New Blog</h2>
            <button
                onClick={() => setShowEditor(!showEditor)}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg mb-6 hover:bg-blue-600 transition-colors"
            >
                {showEditor ? "Hide Editor" : "Show Editor"}
            </button>

            {showEditor && (
                <div className="absolute top-0 left-0 right-0 bg-gray-900 p-4 rounded-lg shadow-md z-10">
                    <h3 className="text-2xl font-semibold mb-4 text-gray-200">Editor</h3>
                    <ReactQuill
                        value={content}
                        onChange={(value) => setContent(value)}
                        className="h-64"
                        theme="snow"
                    />
                </div>
            )}

            <div className="mt-24">
                <div className="flex flex-col mb-6">
                    <label className="text-xl font-semibold text-gray-300 mb-2">Title:</label>
                    <input
                        onChange={(e) => setTitle(e.target.value)}
                        className="bg-gray-700 border border-gray-600 text-white p-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="text"
                        placeholder="Enter Blog Title"
                        value={title}
                    />
                </div>
                <button
                    onClick={handleClick}
                    className="bg-gradient-to-r from-teal-500 to-blue-500 text-white py-3 px-6 rounded-lg shadow-md hover:from-teal-600 hover:to-blue-600 transition-colors duration-300"
                >
                    Create Blog
                </button>
            </div>
        </div>
    );
}
