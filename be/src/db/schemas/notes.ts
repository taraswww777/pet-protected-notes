import { pgTable, serial, text, integer } from 'drizzle-orm/pg-core';
import { users } from './users';

/** Схема таблицы `notes` */
export const notes = pgTable('notes', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  // Меняем тип content на text и переименовываем для ясности
  encryptedContent: text('encrypted_content').notNull(), // IV + ciphertext + authTag (base64)
  // Добавляем новое поле
  encryptedDek: text('encrypted_dek').notNull(), // Ключ (DEK), зашифрованный Master Key (base64)
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
});

/** Тип данных для результатов SELECT-запросов к таблице `notes`. */
export type NoteDTO = typeof notes.$inferSelect;

/** Тип данных для операций INSERT в таблицу `notes`. */
export type NoteInsertDTO = typeof notes.$inferInsert;
