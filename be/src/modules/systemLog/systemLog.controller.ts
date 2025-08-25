import { FastifyRequest } from 'fastify';
import { RequestWithBody } from '../../types/common';
import { SystemLogService } from './systemLog.service';
import { schema } from '../../db';
import { GetByEventTypeQuerystring } from './systemLog.types';
import { PaginationParams } from 'protected-notes-common/src/types/Paginate';
import { PAGE_SIZE_DEFAULT } from 'protected-notes-fe/src/constants/common';

/**
 * Контроллер для работы с системным логом.
 */
export class SystemLogController {
  private readonly systemLogService = new SystemLogService();

  /**
   * Записывает новое событие в системный лог.
   * @param request - Запрос с телом, содержащим данные о событии.
   * @returns Результат записи события в системный лог.
   */
  async logEvent(request: FastifyRequest<RequestWithBody<schema.SystemLogInsert>>) {
    return this.systemLogService.logEvent(request.body, request);
  }

  /**
   * Получает записи системного лога по типу события.
   * @param request - Запрос с параметрами запроса, содержащими тип события и параметры пагинации.
   * @returns Массив записей системного лога, соответствующих заданному типу события.
   */
  async getByEventType(
    request: FastifyRequest<{ Querystring: GetByEventTypeQuerystring }>,
  ) {
    const { eventType, page, limit } = request.query;
    return this.systemLogService.getLogsByEventType(eventType, { page, limit });
  }

  /**
   * Получает все записи системного лога с пагинацией.
   * @param request - Запрос с параметрами запроса, содержащими параметры пагинации.
   * @returns Массив всех записей системного лога с учетом пагинации.
   */
  async getAllLogs(
    request: FastifyRequest<{ Querystring: PaginationParams }>,
  ) {
    const { page = 1, limit = PAGE_SIZE_DEFAULT } = request.query;

    // Преобразуем параметры в числа
    const pageNumber = typeof page === 'string' ? parseInt(page, 10) : page;
    const limitNumber = typeof limit === 'string' ? parseInt(limit, 10) : limit;

    return this.systemLogService.getAllLogs({
      page: pageNumber,
      limit: limitNumber
    });
  }

  /**
   * Экспортирует записи системного лога в CSV формате.
   * @param request - Запрос с параметрами пагинации.
   * @returns CSV файл с записями системного лога.
   */
  async exportLogs(
    request: FastifyRequest<{ Querystring: PaginationParams }>,
  ) {
    const { page, limit } = request.query;
    return this.systemLogService.exportLogs({ page, limit });
  }
}
