// Схема для обновления (все поля опциональны, кроме userId)
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod';
import { schema } from '../../db';
import { z } from 'zod';
import { userInfo } from '../../db/schemas';
import {
  firstNameValidations,
  secondNameValidations,
  thirdNameValidations
} from 'protected-notes-common/src/zodValidators/fioValidations';


// конкретные бизнес схемы для валидации

// Базовые схемы из Drizzle
export const userInfoSelectSchema = createSelectSchema(schema.userInfo);
export const userInfoInsertSchema = createInsertSchema(schema.userInfo);

export const userInfoUpdateValidationSchema = createUpdateSchema(schema.userInfo, {
  firstName: firstNameValidations,
  secondName: secondNameValidations,
  thirdName: thirdNameValidations
})
  .partial() // Все поля опциональны для обновления
  .omit({ userId: true }); // Исключаем userId из тела запроса


// Схема для создания (обязательные поля)
export const userInfoCreateValidationSchema = createInsertSchema(userInfo, {
  firstName: firstNameValidations,
  secondName: secondNameValidations,
  thirdName: thirdNameValidations
})
  .omit({ userId: true }); // userId передается отдельно


export type UserInfoSelect = z.infer<typeof userInfoSelectSchema>;
export type UserInfoInsert = z.infer<typeof userInfoInsertSchema>;

export type UserInfoUpdateBody = z.infer<typeof userInfoUpdateValidationSchema>;
export type UserInfoCreateBody = z.infer<typeof userInfoCreateValidationSchema>;
