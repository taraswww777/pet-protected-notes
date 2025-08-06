import { z } from 'zod';
import { users } from '../schemas';

// Базовые схемы
const BaseUserSchema = z.object({
  login: z.email('Некорректный формат email').min(3).max(50),
  password: z.string()
    .min(8, 'Пароль должен содержать минимум 8 символов')
    .regex(
      /[A-Za-z0-9!@#$%^&*]/,
      'Пароль должен содержать буквы и хотя бы один спецсимвол',
    ),
});

// Функция для преобразования Zod-схемы в формат Fastify
const toFastifySchema = (zodSchema: z.ZodObject<any>) => ({
  body: {
    type: 'object',
    properties: Object.fromEntries(
      Object.entries(zodSchema.shape).map(([key, value]) => {
        if (value instanceof z.ZodString) {
          return [key, { type: 'string' }];
        }
        if (value instanceof z.ZodNumber) {
          return [key, { type: 'number' }];
        }
        return [key, { type: 'unknown' }];
      })
    ),
    required: Object.keys(zodSchema.shape),
  }
});

// Специализированные схемы + типы
export const LoginUserSchema = BaseUserSchema.pick({ login: true, password: true });
export type LoginUserBody = z.infer<typeof LoginUserSchema>;
export const LoginUserFastifySchema = toFastifySchema(LoginUserSchema);


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
