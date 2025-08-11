import { db, schema } from '../../db';
import { desc, eq } from 'drizzle-orm';
import { PaginatedResponse, PaginationParams } from '../../types/common';
import { PaginationUtils } from '../../utils/PaginationUtils';

export class SystemLogService {
  async logEvent(
    eventData: schema.SystemLogInsert,
  ): Promise<schema.SystemLog[]> {
    return db.insert(schema.systemLogs).values(eventData).returning();
  }

  async getLogsByEventType(eventType: keyof typeof schema.LogLevel, paginationParams: PaginationParams = {}): Promise<PaginatedResponse<schema.SystemLog>> {
    return PaginationUtils.paginate<schema.SystemLog>(schema.systemLogs, {
      whereCondition: eq(schema.systemLogs.eventType, eventType),
      orderBy: desc(schema.systemLogs.attemptTime),
      paginationParams,
    });
  }
}
