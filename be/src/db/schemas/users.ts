import { pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

/** Схема таблицы `users` */
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  login: text('login').unique().notNull(),
  password: varchar('password').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/** Тип данных для результатов SELECT-запросов к таблице `users`. */
export type UserDTO = Pick<typeof users.$inferSelect, 'id' | 'login'>;

/** Тип данных для операций INSERT в таблицу `users`. */
export type UserInsertDTO = typeof users.$inferInsert;

export type LoginUserBody = Pick<typeof users.$inferSelect, 'password' | 'login'>;

export type LoginUserSuccessResponse = Pick<typeof users.$inferSelect, 'id'> & {
  token: string;
};

export type RegisterUserBody = Pick<typeof users.$inferSelect, 'password' | 'login'>;


// В файле с типами (db/schemas.ts) нужно добавить тип:
export interface ChangePasswordBody {
  oldPassword: string;
  newPassword: string;
}
