import z from 'zod';

export const SignupSchema = z.object({
    name: z.string().min(4, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    district: z.string().min(2, 'District is required'),
})

export interface ISignUpError {
    name?: string;
    email?: string;
    password?: string;
    district?: string;
}

export type SignupData = z.infer<typeof SignupSchema>;