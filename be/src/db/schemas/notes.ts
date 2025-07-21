import { pgTable, serial, text } from 'drizzle-orm/pg-core';

// Определяем таблицы
export const notes = pgTable('notes', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').unique(),
});

// Экспортируем тип
export type NotesDTO = typeof notes.$inferSelect;
