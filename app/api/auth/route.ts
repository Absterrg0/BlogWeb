import { NextResponse } from 'next/server';
import prisma from '@/db'; // Adjust this path as needed
import bcrypt from 'bcrypt';
import { userSchema } from '@/validate'; // Adjust the path as needed
import { NextRequest } from 'next/server'; // Import the type for the request object

export async function POST(request: NextRequest) { // Use NextRequest type here
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

    } catch (error: any) { // Explicitly type the error as 'any' to avoid issues
        if (error.name === 'ZodError') {
            // Handle validation errors
            const errors = error.errors.map((e: any) => e.message).join(', ');
            return NextResponse.json({ error: `Invalid inputs: ${errors}` }, { status: 400 });
        }

        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
