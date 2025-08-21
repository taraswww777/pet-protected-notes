import { db, schema } from '../../db';
import { desc, eq, sql } from 'drizzle-orm';
import { PaginatedResponse, PaginationParams } from 'protected-notes-common/src/types/Paginate';
import { PaginationUtils } from '../../utils/PaginationUtils';
import { FastifyRequest } from 'fastify';
import { getCurrentUserId } from '../auth';
import { stringify } from 'csv-stringify/sync';
import { users } from '../../db/schemas';

/**
 * Сервис для работы с системным логом.
 */
export class SystemLogService {
  /**
   * Экспортирует записи системного лога в CSV формате.
   * @param paginationParams - Параметры пагинации.
   * @returns CSV строка с записями системного лога.
   */
  async exportLogs(
    paginationParams: PaginationParams = {}
  ): Promise<string> {
    const response = await this.getAllLogs(paginationParams);

    const csvData = response.items.map(log => ({
      ID: log.id,
      'Уровень логирования': log.logLevel,
      'Время события': log.attemptTime,
      'Тип события': log.eventType,
      ['ID пользователя']: log.user?.id,
      ['login пользователя']: log.user?.login,
      // @ts-expect-error metadata это объект
      ['IP адрес']: log?.metadata?.ip,
      // @ts-expect-error metadata это объект
      'User Agent': log?.metadata?.userAgent,
      'Дополнительные данные': log.data ? JSON.stringify(log.data) : '',
    }));

    return stringify(csvData, {
      header: true,
      delimiter: ';',
      quoted: true,
    });
  }


  /**
   * Записывает новое событие в системный лог.
   * @param eventData - Данные о событии без метаданных.
   * @param request - Опциональный объект запроса Fastify для сбора дополнительной информации.
   */
  async logEvent(
    eventData: Omit<schema.SystemLogInsert, 'metadata'>,
    request?: FastifyRequest,
  ) {
    void db.insert(schema.systemLogs)
      .values({
        ...eventData,
        userId: getCurrentUserId(),
        metadata: this.enrichMetadata(request),
      })
      .execute();
  }

  /**
   * Получает записи системного лога по типу события с пагинацией.
   * @param eventType - Тип события.
   * @param paginationParams - Параметры пагинации.
   * @returns Объект с пагинированными записями системного лога.
   */
  async getLogsByEventType(
    eventType: schema.SystemLogSelect['eventType'],
    paginationParams: PaginationParams = {}
  ): Promise<PaginatedResponse<schema.SystemLogSelect>> {

    const baseQuery = db
      .select()
      .from(schema.systemLogs)
      .where(eq(schema.systemLogs.eventType, eventType));

    const countQuery = db
      .select({ count: sql<number>`count(*)` })
      .from(schema.systemLogs)
      .where(eq(schema.systemLogs.eventType, eventType));

    return PaginationUtils.paginate<schema.SystemLogSelect>({
      baseQuery,
      countQuery,
      paginationParams,
      orderBy: desc(schema.systemLogs.attemptTime)
    });
  }

  /**
   * Получает все записи системного лога с пагинацией.
   * @param paginationParams - Параметры пагинации.
   * @returns Объект с пагинированными записями системного лога.
   */
  async getAllLogs(
    paginationParams: PaginationParams = {}
  ): Promise<PaginatedResponse<schema.SystemLogSelect & { user?: schema.UserSelect | null }>> {
    const baseQuery = db
      .select({
        id: schema.systemLogs.id,
        userId: schema.systemLogs.userId,
        logLevel: schema.systemLogs.logLevel,
        attemptTime: schema.systemLogs.attemptTime,
        eventType: schema.systemLogs.eventType,
        metadata: schema.systemLogs.metadata,
        data: schema.systemLogs.data,
        user: sql`(SELECT json_build_object('id', ${users.id}, 'login', ${users.login}) 
                FROM ${users} 
                WHERE ${users.id} = ${schema.systemLogs.userId})`.as('user')
      })
      .from(schema.systemLogs);

    const countQuery = db
      .select({ count: sql<number>`count(*)` })
      .from(schema.systemLogs);

    return PaginationUtils.paginate<schema.SystemLogSelect & {
      user?: { id: number; login: string } | null
    }>({
      baseQuery,
      countQuery,
      paginationParams,
      orderBy: desc(schema.systemLogs.attemptTime)
    });
  }

  /**
   * Обогащает метаданные запроса.
   * @param request - Опциональный объект запроса Fastify.
   * @returns Объект с метаданными запроса.
   */
  private enrichMetadata(
    request?: FastifyRequest,
  ): Record<string, unknown> {
    const headers = request?.headers || {};
    const userId = getCurrentUserId();

    return {
      currentUserId: userId,
      ip: request?.ip,
      ips: request?.ips, // Для случаев с прокси/балансировщиками
      userAgent: headers['user-agent'],
      referer: headers['referer'],
      host: headers['host'],
      requestId: headers['x-request-id'], // Для трейсинга
      forwardedFor: headers['x-forwarded-for'],
      protocol: request?.protocol,
      method: request?.method,
      url: request?.url,
      // Дополнительные полезные поля:
      contentType: headers['content-type'],
      acceptLanguage: headers['accept-language'],
      correlationId: headers['x-correlation-id'],
      serviceVersion: headers['x-service-version'],
    };
  }
}
