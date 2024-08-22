import { NextResponse } from 'next/server';
import prisma from '@/db'; // Adjust this path as needed
import bcrypt from 'bcrypt';
import { userSchema } from '@/validate'; // Adjust the path as needed

export async function POST(request: Request) {
    try {
        // Parse and validate the request data
        const { name, email, username, password } = await request.json();
        
        // Validate using the Zod schema
        userSchema.parse({ name, email, username, password });

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { username }
        });

        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new user
        await prisma.user.create({
            data: {
                name,
                email,
                username,
                password: hashedPassword
            }
        });

        return NextResponse.json({ message: 'User created successfully' }, { status: 201 });

    } catch (error) {
        if (error.name === 'ZodError') {
            // Handle validation errors
            const errors = error.errors.map(e => e.message).join(', ');
            return NextResponse.json({ error: `Invalid inputs: ${errors}` }, { status: 400 });
        }

        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
