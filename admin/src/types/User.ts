import z from 'zod'
export interface UserResponseDto {
  id: number;
  username: string;
  email: string;
  district: string;
  role: Role;
}
type Role = "ADMIN" | "USER" | "MODERATOR"; 

export type IUserResponse   = Partial<UserResponseDto>

export const districtAdminSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be at most 50 characters"),
    email: z.string().email("Enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")

    ,confirmPassword: z.string(),
    district: z
      .string()
      .min(2, "District must be at least 2 characters")
      .max(100, "District name is too long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });