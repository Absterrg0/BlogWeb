import { NextResponse } from 'next/server';
import prisma from '@/db';

export async function POST(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    const { content } = await request.json();

    if (!content || !id) {
        return NextResponse.json({ error: 'Content and Post ID are required' }, { status: 400 });
    }

    try {
        const comment = await prisma.comment.create({
            data: {
                content,
                postId: parseInt(id),
                parentId: null,
                authorId: 1, // Replace with actual user ID
            },
        });

        return NextResponse.json(comment);
    } catch (error) {
        console.error('Error creating comment:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
