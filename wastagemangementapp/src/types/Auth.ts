import z from 'zod';

export const LoginFormSchema = z.object({
  email: z.string().email('Please provide a valid email'),
  password: z.string().min(6, 'Please provide a valid password'),
});




export interface ILoginError {
    email?: string;
    password?: string;
}