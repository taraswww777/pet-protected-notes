import { jsonb, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { enumToPgEnum } from '../utils';

export const LogLevel = {
  INFO: 'INFO',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
  WARNING: 'WARNING',
  DEBUG: 'DEBUG',
  CRITICAL: 'CRITICAL',
} as const;

export const logLevelPgEnum = enumToPgEnum('log_level_enum', LogLevel);

export const systemLogs = pgTable('system_logs', {
  id: serial('id').primaryKey(),
  logLevel: logLevelPgEnum('log_level').notNull().default(LogLevel.INFO),
  attemptTime: timestamp('attempt_time').defaultNow().notNull(),
  eventType: text('event_type').notNull(), // 'Тип события: auth/login, auth/register, user/update и т.д.'
  metadata: jsonb('metadata').notNull(), // Добавляются в SystemLogService
  data: jsonb('data'), // 'Любые дополнительные метаданные' указываются потребителем сервиса SystemLogService
});

export type SystemLogSelect = typeof systemLogs.$inferSelect;
export type SystemLogInsert = typeof systemLogs.$inferInsert;
