import { pgTable, serial, text } from 'drizzle-orm/pg-core';

// Определяем таблицы
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').unique(),
});

// Экспортируем тип
export type User = typeof users.$inferSelect;
