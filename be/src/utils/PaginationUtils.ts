import { db } from '../db';
import { SQL, sql } from 'drizzle-orm';
import { PaginatedResponse, PaginationParams } from '../types/common';
import { PgTable } from 'drizzle-orm/pg-core';


interface PaginateParams {
  whereCondition?: SQL<unknown>,
  paginationParams?: PaginationParams,
  orderBy?: any
}

export class PaginationUtils {
  static async paginate<T extends Record<string, unknown>>(
    table: PgTable,
    { whereCondition, paginationParams, orderBy }: PaginateParams = {}
  ): Promise<PaginatedResponse<T>> {
    const { page = 1, limit = 10 } = paginationParams || {};

    const offsetCount = (page - 1) * limit;

    // Создаем базовый запрос для получения данных
    const dataQuery = whereCondition ? db.select().from(table).where(whereCondition) : db.select().from(table);

    // Создаем запрос для подсчета общего количества
    const countQuery = whereCondition ? db.select({
      count: sql<number>`count(*)`
    }).from(table).where(whereCondition) : db.select({
      count: sql<number>`count(*)`
    }).from(table);

    const resultDataQuery = orderBy ? dataQuery.orderBy(orderBy) : dataQuery;

    // Выполняем оба запроса параллельно
    const [items, total] = await Promise.all([
      resultDataQuery.limit(limit).offset(offsetCount).execute() as Promise<T[]>,
      countQuery.then(res => Number(res[0]?.count ?? 0))
    ]);

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

  static async countFromTable(table: any, whereCondition?: any): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(id)` })
      .from(table)
      .where(whereCondition)
      .then((res) => res[0]?.count || 0);

    return +result;
  }
}
