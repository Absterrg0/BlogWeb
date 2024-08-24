"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

interface PostCardProps {
    id: number; // Add ID for routing
    title: string;
    content: string;
    author: string;
}

const PostCard: React.FC<PostCardProps> = ({ id, title, content, author }) => {
    const router = useRouter();

    const handleClick = () => {
        router.push(`/blogs/${id}`); // Navigate to the post details page
    };

    return (
        <div
            onClick={handleClick}
            className="w-full p-8 bg-gray-900 border border-gray-700 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-600 hover:shadow-2xl transition-shadow duration-300 ease-in-out cursor-pointer"
        >
            <h5 className="mb-4 text-3xl font-bold text-gray-100 dark:text-gray-200">{title}</h5>
            <p className="mb-6 text-gray-300 dark:text-gray-400 line-clamp-4">{content}</p>
            <p className="text-lg font-medium text-gray-400 dark:text-gray-500 text-right">By {author}</p>
        </div>
    );
};

export default PostCard;
