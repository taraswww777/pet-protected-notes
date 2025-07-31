// notes.schema.ts
import { z } from "zod";
import {schema} from '../../db';

// Базовые схемы
export const noteIdSchema = z.object({
  id: z.number().int().positive("ID должен быть положительным числом"),
});

export const notePaginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
});

export const noteCreateSchema = z.object({
  title: z.string().min(1, "Название не может быть пустым").max(100),
  content: z.string().min(1, "Контент не может быть пустым"),
}) satisfies z.ZodType<schema.NoteInsertDTO>;

export const noteUpdateSchema = noteCreateSchema.partial();

// Расширенные типы для эндпоинтов
export type NoteWithId = z.infer<typeof noteIdSchema>;
export type NotePagination = z.infer<typeof notePaginationSchema>;
