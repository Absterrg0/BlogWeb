"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';

interface Comment {
    id: number;
    content: string;
    createdAt: string;
    author: {
        username: string;
    };
    replies?: Comment[];
    parentId?: number;
}

interface Post {
    id: number;
    title: string;
    content: string;
    createdAt: string;
    author: {
        username: string;
    };
    comments?: Comment[];
}

export default function PostPage({ params }: { params: { id: string } }) {
    const [post, setPost] = useState<Post | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [replyToCommentId, setReplyToCommentId] = useState<number | null>(null);
    const [replyToUsername, setReplyToUsername] = useState<string | null>(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`/api/posts/${params.id}`);
                setPost(response.data);
            } catch (error) {
                console.error('Error fetching post:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPost();
        const interval = setInterval(fetchPost, 2000); // Refresh every 2 seconds
        return () => clearInterval(interval); // Cleanup on component unmount
    }, [params.id]);

    const handleSubmitComment = async () => {
        if (!newComment) return;

        try {
            if (replyToCommentId) {
                await axios.post(`/api/posts/${params.id}/comments/${replyToCommentId}/replies`, { content: newComment });
            } else {
                await axios.post(`/api/posts/${params.id}/comments`, { content: newComment });
            }
            setNewComment('');
            setReplyToCommentId(null);
            setReplyToUsername(null);
        } catch (error) {
            console.error('Error submitting comment:', error);
        }
    };

    const handleReplyClick = (comment: Comment) => {
        setReplyToCommentId(comment.id);
        setReplyToUsername(comment.author.username);
    };

    const renderComments = (comments: Comment[] = []) => {
        return (
            <ul className="space-y-4">
                {comments.map(comment => (
                    <li key={comment.id} className="p-4 bg-gray-700 rounded-lg mb-4">
                        <p className="font-semibold text-gray-100">{comment.author.username}</p>
                        <p className="mt-2 text-gray-300">{comment.content}</p>
                        <p className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</p>
                        <button
                            onClick={() => handleReplyClick(comment)}
                            className="mt-2 text-blue-500 hover:underline"
                        >
                            Reply
                        </button>
                    </li>
                ))}
            </ul>
        );
    };

    if (isLoading) return <div className="text-center py-20">Loading...</div>;

    return (
        <div className="bg-gray-900 min-h-screen flex flex-col p-6">
            <main className="max-w-2xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
                {post ? (
                    <>
                        <h1 className="text-4xl font-bold text-gray-100 mb-4">{post.title}</h1>
                        <p className="text-sm text-gray-400 mb-4">By {post.author.username} on {new Date(post.createdAt).toLocaleDateString()}</p>
                        <div className="mb-6">
                            <p className="text-lg text-gray-200">{post.content}</p>
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-100 mb-4">Comments</h2>
                            {post.comments?.length === 0 ? (
                                <p className="text-gray-400">No comments yet</p>
                            ) : (
                                renderComments(post.comments || [])
                            )}
                        </div>
                        <div className="mt-8">
                            <h3 className="text-xl font-semibold text-gray-100 mb-2">
                                {replyToCommentId ? `Replying to ${replyToUsername}` : 'Add a Comment'}
                            </h3>
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="w-full p-4 bg-gray-700 text-gray-200 rounded-lg"
                                rows={4}
                                placeholder="Write your comment here..."
                            />
                            <button
                                onClick={handleSubmitComment}
                                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                            >
                                Submit Comment
                            </button>
                        </div>
                    </>
                ) : (
                    <p className="text-gray-400">Post not found</p>
                )}
            </main>
            <footer className="text-center text-gray-500 py-4">
                © 2024 My Blog - All rights reserved
            </footer>
        </div>
    );
}
