// Схема для обновления (все поля опциональны, кроме userId)
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod';
import { schema } from '../../db';
import { z } from 'zod';
import { userInfo } from '../../db/schemas';

// общие атомарные схемы валидаций

/** Функция для создания схемы имени с общими правилами валидации */
const firstName = (schema: z.ZodString) =>
  schema
    .min(2, 'Имя должно содержать минимум 2 символа')
    .max(50, 'Имя не должно превышать 50 символов')
    .regex(/^[a-zA-Zа-яА-ЯёЁ\s-]+$/, 'Имя может содержать только буквы, дефисы и пробелы')
    .nullable()
    .optional();

const secondName = (schema: z.ZodString) => schema
  .min(2, 'Отчество должно содержать минимум 2 символа')
  .max(50, 'Отчество не должно превышать 50 символов')
  .regex(/^[a-zA-Zа-яА-ЯёЁ\s-]+$/, 'Отчество может содержать только буквы, дефисы и пробелы')
  .nullable()
  .optional();

const thirdName = (schema: z.ZodString) => schema
  .min(2, 'Фамилия должна содержать минимум 2 символа')
  .max(50, 'Фамилия не должна превышать 50 символов')
  .regex(/^[a-zA-Zа-яА-ЯёЁ\s-]+$/, 'Фамилия может содержать только буквы, дефисы и пробелы')
  .nullable()
  .optional();



// конкретные бизнес схемы для валидации

// Базовые схемы из Drizzle
export const userInfoSelectSchema = createSelectSchema(schema.userInfo);
export const userInfoInsertSchema = createInsertSchema(schema.userInfo);

export const userInfoUpdateValidationSchema  = createUpdateSchema(schema.userInfo, {
  firstName,
  secondName,
  thirdName
})
  .partial() // Все поля опциональны для обновления
  .omit({ userId: true }); // Исключаем userId из тела запроса


// Схема для создания (обязательные поля)
export const userInfoCreateValidationSchema = createInsertSchema(userInfo, {
  firstName,
  secondName,
  thirdName
})
  .omit({ userId: true }); // userId передается отдельно



export type UserInfoSelect = z.infer<typeof userInfoSelectSchema>;
export type UserInfoInsert = z.infer<typeof userInfoInsertSchema>;

export type UserInfoUpdateBody = z.infer<typeof userInfoUpdateValidationSchema>;
export type UserInfoCreateBody = z.infer<typeof userInfoCreateValidationSchema>;
