import { db } from '../db';
import { SQL, sql } from 'drizzle-orm';
import { PaginatedResponse, PaginationParams } from 'protected-notes-common/src/types/Paginate';
import { PgTable } from 'drizzle-orm/pg-core';


interface PaginateParams {
  baseQuery: any;
  countQuery: any;
  paginationParams?: PaginationParams;
  orderBy?: any;
}

export class PaginationUtils {
  static async paginate<T extends Record<string, unknown>>(
    params: PaginateParams
  ): Promise<PaginatedResponse<T>> {
    const { baseQuery, countQuery, paginationParams, orderBy } = params;
    const { page = 1, limit = 10 } = paginationParams || {};
    const offset = (page - 1) * limit;

    // Выполняем оба запроса параллельно
    const [items, totalResult] = await Promise.all([
      // Запрос данных с пагинацией
      (orderBy ? baseQuery.orderBy(orderBy) : baseQuery)
        .limit(limit)
        .offset(offset)
        .execute() as Promise<T[]>,

      // Запрос для подсчета общего количества
      countQuery.then((res: any[]) => Number(res[0]?.count ?? 0))
    ]);

    const total = Number(totalResult);
    const totalPages = Math.ceil(total / limit);

    return {
      items,
      countItems: items.length,
      total,
      currentPage: page,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
    };
  }

  // Вспомогательный метод для простых запросов к одной таблице
  static async paginateTable<T extends Record<string, unknown>>(
    table: PgTable,
    { whereCondition, paginationParams, orderBy }: {
      whereCondition?: SQL<unknown>,
      paginationParams?: PaginationParams,
      orderBy?: any
    } = {}
  ): Promise<PaginatedResponse<T>> {
    const baseQuery = whereCondition
      ? db.select().from(table).where(whereCondition)
      : db.select().from(table);

    const countQuery = whereCondition
      ? db.select({ count: sql<number>`count(*)` }).from(table).where(whereCondition)
      : db.select({ count: sql<number>`count(*)` }).from(table);

    return this.paginate<T>({
      baseQuery,
      countQuery,
      paginationParams,
      orderBy
    });
  }
}
