import { db, schema } from '../../db';
import { desc, eq } from 'drizzle-orm';
import { PaginatedResponse, PaginationParams } from '../../types/common';
import { PaginationUtils } from '../../utils/PaginationUtils';
import { FastifyRequest } from 'fastify';
import { getCurrentUserId } from '../auth';

export class SystemLogService {
  async logEvent(
    eventData: Omit<schema.SystemLogInsert, 'metadata'>,
    request?: FastifyRequest,
  ) {
    void db.insert(schema.systemLogs)
      .values({
        ...eventData,
        metadata: this.enrichMetadata(request),
      })
      .execute();
  }

  async getLogsByEventType(eventType: keyof typeof schema.LogLevel, paginationParams: PaginationParams = {}): Promise<PaginatedResponse<schema.SystemLogSelect>> {
    return PaginationUtils.paginate<schema.SystemLogSelect>(schema.systemLogs, {
      whereCondition: eq(schema.systemLogs.eventType, eventType),
      orderBy: desc(schema.systemLogs.attemptTime),
      paginationParams,
    });
  }

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
