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
export type UserDTO = Omit<typeof users.$inferSelect, 'password'>;

/** Тип данных для операций INSERT в таблицу `users`. */
export type UserInsertDTO = typeof users.$inferInsert;
