import {z} from 'zod'

export const userSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address").min(1, "Email is required"),
    username: z.string().min(1, "Username is required"),
    password: z.string().min(6, "Minimum 6 characters password is required")
});
