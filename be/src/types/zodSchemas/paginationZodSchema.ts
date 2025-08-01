import { z } from 'zod';
import { RequestWithQuery } from '../common.js';

export const paginatedResponseSchema = <T extends z.ZodTypeAny>(schema: T) =>
  z.object({
    items: z.array(schema),
    total: z.number().int().nonnegative(),
    countItems: z.number().int().nonnegative(),
    currentPage: z.number().int().positive(),
    totalPages: z.number().int().positive(),
    hasNext: z.boolean(),
    hasPrevious: z.boolean(),
  });

// Заменяем PaginationParams
export const paginationParamsSchema = z.object({
  page: z.number().int().positive().optional().default(1),
  limit: z.number().int().positive().max(100).optional().default(10),
});

// Получаем типы, эквивалентные оригинальным интерфейсам
export type PaginationParams = z.infer<typeof paginationParamsSchema>;

// Получаем типы, эквивалентные оригинальным интерфейсам
export type PaginatedResponse = z.infer<typeof paginatedResponseSchema>;

export type RouteWithPagination = RequestWithQuery<PaginationParams>
