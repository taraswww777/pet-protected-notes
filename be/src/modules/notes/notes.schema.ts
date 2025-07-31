// notes.schema.ts
import { z, ZodObject } from "zod";
import { schema } from '../../db';

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

export const noteSchema = z.object({
  id: z.number().min(1, "Название не может быть пустым").nonnegative(),
  title: z.string().min(1, "Название не может быть пустым").max(100),
  content: z.string().min(1, "Контент не может быть пустым"),
}) satisfies z.ZodType<schema.NoteInsertDTO>;

const pageableListSchema = (zodObject: ZodObject) => ({
  items: z.array(zodObject),
  countItems: z.number().min(0).nonnegative(),
  total: z.number().min(0).nonnegative(),
  currentPage: z.number().min(0).nonnegative(),
  totalPages: z.number().min(0).nonnegative(),
  hasNext: z.boolean(),
  hasPrevious: z.boolean(),
})

export const noteListSchema = pageableListSchema(noteSchema);

