import { NextResponse } from 'next/server';
import prisma from '@/db';

export async function POST(request: Request, { params }: { params: { id: string; commentId: string } }) {
    const { id, commentId } = params;
    const { content } = await request.json();

    if (!content || !id || !commentId) {
        return NextResponse.json({ error: 'Content, Post ID, and Comment ID are required' }, { status: 400 });
    }

    try {
        const reply = await prisma.comment.create({
            data: {
                content,
                postId: parseInt(id),
                parentId: parseInt(commentId),
                authorId: 1, // Replace with actual user ID
            },
        });

        return NextResponse.json(reply);
    } catch (error) {
        console.error('Error creating reply:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
