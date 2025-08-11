import { FastifyRequest } from 'fastify';
import { RequestWithBody } from '../../types/common';
import { SystemLogService } from './systemLog.service';
import { schema } from '../../db';
import { GetByEventTypeQuerystring } from './systemLog.types';

export class SystemLogController {
  private readonly systemLogService = new SystemLogService();

  async logEvent(request: FastifyRequest<RequestWithBody<schema.SystemLogInsert>>) {
    return this.systemLogService.logEvent(request.body);
  }

  async getByEventType(
    request: FastifyRequest<{ Querystring: GetByEventTypeQuerystring }>
  ) {
    const { eventType, page, limit } = request.query;


    return this.systemLogService.getLogsByEventType(eventType, { page, limit });
  }
}
