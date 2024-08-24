import { NextResponse } from 'next/server';
import prisma from '@/db'; // Adjust import path as necessary

export async function DELETE(request: Request, { params }: { params: { id: string, commentId: string } }) {
    const { id, commentId } = params;

    if (!id || !commentId) {
        return NextResponse.json({ error: 'Post ID and Comment ID are required' }, { status: 400 });
    }

    try {
        await prisma.comment.delete({
            where: { id: parseInt(commentId) },
        });

        return NextResponse.json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
