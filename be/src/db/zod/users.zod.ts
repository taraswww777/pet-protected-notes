import { z } from 'zod';
import { users } from '../schemas';

// Базовые схемы
const BaseUserSchema = z.object({
  login: z.string().min(3).max(50),
  password: z.string().min(8).regex(/[A-Za-z0-9!@#$%^&*]/),
});

// Специализированные схемы + типы
export const LoginUserSchema = BaseUserSchema.pick({ login: true, password: true });
export type LoginUserBody = z.infer<typeof LoginUserSchema>;

export const RegisterUserSchema = BaseUserSchema.pick({ login: true, password: true });
export type RegisterUserBody = z.infer<typeof RegisterUserSchema>;

export const ChangePasswordSchema = z.object({
  oldPassword: z.string().min(8),
  newPassword: z.string().min(8).regex(/[A-Za-z0-9!@#$%^&*]/),
});
export type ChangePasswordBody = z.infer<typeof ChangePasswordSchema>;

export const ForgotPasswordSchema = z.object({ login: z.string().email() });
export type ForgotPasswordBody = z.infer<typeof ForgotPasswordSchema>;

export const ResetPasswordSchema = z.object({
  login: z.string().email(),
  resetCode: z.string().length(6),
  newPassword: z.string().min(8),
});
export type ResetPasswordBody = z.infer<typeof ResetPasswordSchema>;
