import { pgTable, serial, text } from 'drizzle-orm/pg-core';

/** Схема таблицы `notes` */
export const notes = pgTable('notes', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').unique(),
});

/** Тип данных для результатов SELECT-запросов к таблице `notes`. */
export type NoteDTO = typeof notes.$inferSelect;

/** Тип данных для операций INSERT в таблицу `notes`. */
export type NoteInsertDTO = typeof notes.$inferInsert;
