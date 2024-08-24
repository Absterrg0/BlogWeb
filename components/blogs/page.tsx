"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PostCard from '@/components/blogs/card';
import AppBar from '@/components/blogs/appbar';
import { useSession } from 'next-auth/react';
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css"; // Import Quill's CSS

// Dynamically import Quill to prevent server-side rendering issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

// Function to remove <p> tags
const removePTags = (html: string) => {
    return html.replace(/<\/?p>/g, '');
};

interface Post {
    id: number;
    title: string;
    content: string;
    author: { username: string };
}

export default function PostPage() {
    const { data: session } = useSession();
    const [posts, setPosts] = useState<Post[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newPost, setNewPost] = useState<{ title: string; content: string }>({
        title: '',
        content: '',
    });

    const handleCreateBlog = () => {
        setIsCreating(!isCreating);
    };

    const handleSubmit = async () => {
        try {
            // Strip <p> tags from content
            const cleanContent = removePTags(newPost.content);

            const response = await axios.post('/api/createBlogs', {
                title: newPost.title,
                content: cleanContent,
                authorId: session?.user?.id,
            });
            setPosts([...posts, response.data.blog]);
            setIsCreating(false);
            setNewPost({ title: '', content: '' });
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('/api/createBlogs');
                setPosts(response.data.blogs);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, []);

    return (
        <div className="bg-gray-900 min-h-screen text-gray-200">
            <AppBar />
            <main className="pt-20 p-6 flex justify-center items-center">
                <div className="bg-gray-800 p-8 rounded-lg shadow-lg mx-auto max-w-7xl w-full">
                    <div className="flex justify-between mb-8">
                        <button
                            onClick={handleCreateBlog}
                            type="button"
                            className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2"
                        >
                            {isCreating ? 'Cancel' : 'Create Blog'}
                        </button>
                    </div>
                    {isCreating && (
                        <div className="bg-gray-700 p-6 rounded-lg mb-8">
                            <h3 className="text-xl font-semibold mb-4 text-gray-200">New Blog Post</h3>
                            <div className="mb-4">
                                <label className="block text-gray-300 mb-1">Title:</label>
                                <input
                                    type="text"
                                    value={newPost.title}
                                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                                    className="bg-gray-600 text-white p-2 rounded-lg w-full"
                                    placeholder="Blog Title"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-300 mb-1">Content:</label>
                                <ReactQuill
                                    value={newPost.content}
                                    onChange={(value) => setNewPost({ ...newPost, content: value })}
                                    className="bg-gray-600 text-white rounded-lg w-full"
                                    theme="snow"
                                    placeholder="Write your content here..."
                                />
                            </div>
                            <button
                                onClick={handleSubmit}
                                type="button"
                                className="text-white bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                            >
                                Submit
                            </button>
                        </div>
                    )}
                    <h2 className="text-3xl font-semibold mb-8 text-gray-200 text-center">Recent Posts</h2>
                    {posts.length === 0 ? (
                        <div className="text-center text-gray-400">No posts available</div>
                    ) : (
                        <div className="grid grid-cols-1 gap-8">
                            {posts.map((post) => (
                                <PostCard
                                    key={post.id}
                                    id={post.id} // Pass ID for navigation
                                    title={post.title}
                                    content={post.content}
                                    author={post.author?.username || 'Unknown'}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
