import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(1, 'Password is required')
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9\s]/, 'Password must contain at least one special character');

export const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, 'Name is required').min(2, 'Name must be at least 2 characters').max(50)
      .regex(/^[\p{L} ]+$/u, 'Name can only contain letters and spaces'),
    email: z.string().trim().toLowerCase().min(1, 'Email is required').email('Invalid email address'),
    password: passwordSchema,
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().toLowerCase().min(1, 'Email is required').email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().trim().toLowerCase().email('Invalid email address'),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().regex(/^[a-f0-9]{64}$/i, 'Invalid password reset token'),
    password: passwordSchema,
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];

