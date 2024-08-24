import authValues from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db";

// POST endpoint for creating a new blog
export async function POST(req: NextRequest) {
    const session = await getServerSession(authValues);

    if (!session?.user) {
        return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    }

    try {
        const { title, content } = await req.json();

        if (!title || !content) {
            return NextResponse.json({ msg: "Missing title or content" }, { status: 400 });
        }

        const blog = await prisma.blog.create({
            data: {
                title,
                content,
                author: { connect: { id: parseInt(session.user.id) } }
            }
        });

        return NextResponse.json({ blog }, { status: 201 });
    } catch (error) {
        console.error("Error creating blog:", error);
        return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
    }
}

// GET endpoint for fetching all blogs
export async function GET() {
    const session = await getServerSession(authValues);

    if (!session?.user) {
        return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    }

    try {
        const blogs = await prisma.blog.findMany({
            include: {
                author:{
                    select:{
                        username:true
                    }
                },
                comments: true,
                reactions: true,
            }
        });

        return NextResponse.json({ blogs }, { status: 200 });
    } catch (error) {
        console.error("Error fetching blogs:", error);
        return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
    }
}
