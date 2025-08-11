import { FastifyInstance } from 'fastify';
import { SystemLogController } from './systemLog.controller';
import { RequestWithBody } from '../../types/common';
import { GetByEventTypeQuerystring } from './systemLog.types';
import { schema } from '../../db';

export async function systemLogRoutes(server: FastifyInstance) {

  const systemLogController = new SystemLogController();

  server.post<RequestWithBody<schema.SystemLogInsert>>('/log-event',
    (req) => systemLogController.logEvent(req));


  server.get<{ Querystring: GetByEventTypeQuerystring }>(
    '/by-event-type',
    (req) => systemLogController.getByEventType(req)
  );
}
