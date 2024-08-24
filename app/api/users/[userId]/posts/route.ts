import { NextResponse } from 'next/server';
import prisma from '@/db';

export async function GET(request: Request, { params }: { params: { userId: string } }) {
    const { userId } = params;

    if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    try {
        const posts = await prisma.blog.findMany({
            where: {
                authorId: Number(userId),
            },
        });

        return NextResponse.json({ posts });
    } catch (error) {
        console.error('Error fetching user posts:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
