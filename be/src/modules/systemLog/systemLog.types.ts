import { PaginationParams } from '../../types/common';
import { schema } from '../../db';

export interface GetByEventTypeQuerystring extends PaginationParams{
  eventType: keyof typeof schema.LogLevel
}
