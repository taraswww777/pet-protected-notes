import { FastifyInstance } from 'fastify';
import { SystemLogController } from './systemLog.controller';
import { RequestWithBody } from '../../types/common';
import { GetByEventTypeQuerystring } from './systemLog.types';
import { schema } from '../../db';
import { PaginationParams } from 'protected-notes-common/src/types/Paginate';

/**
 * Регистрация маршрутов для системы логирования.
 * @param server - Экземпляр Fastify сервера.
 */
export async function systemLogRoutes(server: FastifyInstance) {
  const systemLogController = new SystemLogController();

  /**
   * Маршрут для записи нового события в системный лог.
   * @param req - Запрос с телом, содержащим данные о событии.
   */
  server.post<RequestWithBody<schema.SystemLogInsert>>('/log-event',
    (req) => systemLogController.logEvent(req));

  /**
   * Маршрут для получения записей системного лога по типу события.
   * @param req - Запрос с параметрами запроса, содержащими тип события.
   */
  server.get<{ Querystring: GetByEventTypeQuerystring }>(
    '/by-event-type',
    (req) => systemLogController.getByEventType(req)
  );

  /**
   * Маршрут для получения всех записей системного лога с пагинацией.
   * @param req - Запрос с параметрами запроса, содержащими параметры пагинации.
   */
  server.get<{ Querystring: PaginationParams }>(
    '/all',
    (req) => systemLogController.getAllLogs(req)
  );

  /**
   * Маршрут для экспорта записей системного лога в CSV формате.
   * @param req - Запрос с параметрами запроса, содержащими параметры пагинации.
   */
  server.get<{ Querystring: PaginationParams }>(
    '/export',
    {
      schema: {
        querystring: {
          type: 'object',
          properties: {
            page: { type: 'number', minimum: 1 },
            limit: { type: 'number', minimum: 1, maximum: 1000 }
          }
        }
      }
    },
    async (req, reply) => {
      try {
        const csvData = await systemLogController.exportLogs(req);

        // Правильно устанавливаем заголовки для CSV с BOM для Excel
        reply.header('Content-Type', 'text/csv; charset=utf-8');
        reply.header('Content-Disposition', 'attachment; filename="system-logs-export.csv"');
        reply.header('Content-Transfer-Encoding', 'binary');

        // Добавляем BOM (Byte Order Mark) для корректного отображения в Excel
        const bom = '\uFEFF';
        return bom + csvData;
      } catch (error) {
        server.log.error('Export error:', error);
        reply.status(500).send({ error: 'Failed to export logs' });
      }
    }
  );
}
