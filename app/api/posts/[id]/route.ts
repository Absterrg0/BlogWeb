import { NextResponse } from 'next/server';
import prisma from '@/db';

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    try {
        const post = await prisma.blog.findUnique({
            where: { id: parseInt(id) },
            include: {
                comments: {
                    include: {
                        author: true,
                        replies: {
                            include: {
                                author: true
                            }
                        }
                    },
                },
                author: true,
            },
        });

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        return NextResponse.json(post);
    } catch (error) {
        console.error('Error fetching post:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}


export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    if (!id) {
        return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    try {
        await prisma.blog.delete({
            where: { id: Number(id) },
        });
        return NextResponse.json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

