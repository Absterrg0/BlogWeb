// File: /app/pages/posts/[id]/page.tsx

"use client";

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

interface Comment {
  id: number;
  content: string;
  createdAt: string;
  author: {
    name: string;
  };
  replies: Comment[];
  replyingTo?: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  author: {
    name: string;
  };
  comments: Comment[];
}

export default function PostPage({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [replyToCommentId, setReplyToCommentId] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const commentBoxRef = useRef<HTMLTextAreaElement>(null);

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
  }, [params.id]);

  const handleSubmitComment = async () => {
    if (!newComment) return;

    try {
      await axios.post(`/api/posts/${params.id}/comments`, { content: newComment });
      setNewComment('');
      // Optionally refetch or update the comments list
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  const handleReply = (commentId: number) => {
    setReplyToCommentId(commentId);
    if (commentBoxRef.current) {
      commentBoxRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmitReply = async (commentId: number) => {
    if (!replyContent) return;

    try {
      await axios.post(`/api/posts/${params.id}/comments/${commentId}/replies`, {
        content: replyContent,
        replyingTo: post?.comments.find(comment => comment.id === commentId)?.author.name,
      });
      setReplyContent('');
      setReplyToCommentId(null);
      // Optionally refetch or update the comments list
    } catch (error) {
      console.error('Error submitting reply:', error);
    }
  };

  if (isLoading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col justify-between p-6">
      <main className="max-w-2xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
        {post ? (
          <>
            <h1 className="text-4xl font-bold text-gray-100 mb-4">{post.title}</h1>
            <p className="text-sm text-gray-400 mb-4">By {post.author.name} on {new Date(post.createdAt).toLocaleDateString()}</p>
            <div className="mb-6">
              <p className="text-lg text-gray-200">{post.content}</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold text-gray-100 mb-4">Comments</h2>
              {post.comments.length === 0 ? (
                <p className="text-gray-400">No comments yet</p>
              ) : (
                <ul className="space-y-4">
                  {post.comments.map(comment => (
                    <li key={comment.id} className="bg-gray-700 p-4 rounded-lg">
                      <p className="font-semibold text-gray-100">{comment.author.name}</p>
                      <p className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</p>
                      <p className="mt-2 text-gray-300">{comment.content}</p>
                      {comment.replies.length > 0 && (
                        <ul className="mt-4 space-y-2">
                          {comment.replies.map(reply => (
                            <li key={reply.id} className="bg-gray-600 p-3 rounded-lg">
                              <p className="text-gray-300">Replying to {reply.replyingTo}</p>
                              <p className="font-semibold text-gray-100">{reply.author.name}</p>
                              <p className="text-xs text-gray-500">{new Date(reply.createdAt).toLocaleDateString()}</p>
                              <p className="mt-2 text-gray-300">{reply.content}</p>
                            </li>
                          ))}
                        </ul>
                      )}
                      <button
                        onClick={() => handleReply(comment.id)}
                        className="mt-2 text-blue-400 hover:text-blue-300 focus:outline-none"
                      >
                        Reply
                      </button>
                      {replyToCommentId === comment.id && (
                        <div className="mt-4">
                          <textarea
                            ref={commentBoxRef}
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            className="w-full px-3 py-2 dark:bg-gray-900 rounded-sm border dark:border-none border-gray-300 focus:outline-none border-solid focus:border-dashed resize-none"
                            rows="3"
                            placeholder={`Replying to ${comment.author.name}`}
                          ></textarea>
                          <button
                            onClick={() => handleSubmitReply(comment.id)}
                            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                          >
                            Submit Reply
                          </button>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-100 mb-2">Add a Comment</h3>
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
