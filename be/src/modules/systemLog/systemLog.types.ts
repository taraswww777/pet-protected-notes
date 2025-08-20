import { PaginationParams } from 'protected-notes-common/src/types/Paginate';
import { schema } from '../../db';

export interface GetByEventTypeQuerystring extends PaginationParams {
  eventType: keyof typeof schema.LogLevel
}
