import { z } from "zod";

// Заменяем WithId
export const withIdSchema = z.object({
  id: z.string().min(1, "ID не может быть пустым"),
});

// Утилиты для запросов (аналоги RequestWithQuery, RequestWithBody)
export const requestWithQuerySchema = <T extends z.ZodTypeAny>(schema: T) =>
  z.object({ Querystring: schema });

export const requestWithBodySchema = <T extends z.ZodTypeAny>(schema: T) =>
  z.object({ Body: schema });
