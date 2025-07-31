import { z } from "zod";
import { schema } from '../../db';


// Zod-схемы
export const loginSchema = z.object({
  login: z.string().min(3, "Логин должен быть не короче 3 символов"),
  password: z.string().min(6, "Пароль должен быть не короче 6 символов"),
}) satisfies z.ZodType<schema.LoginUserBody>;

export const registerSchema = loginSchema satisfies z.ZodType<schema.RegisterUserBody>;
