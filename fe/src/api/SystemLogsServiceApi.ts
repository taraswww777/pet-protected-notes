import { PaginatedResponse, PaginationParams } from 'protected-notes-common/src/types/Paginate.ts';
import { PAGE_SIZE_DEFAULT } from '../constants/common.ts';
import { AxiosResponse } from 'axios';
import { axiosInstance } from './asiosInstanse.ts';
import { schema } from 'protected-notes-be/src/db/index.ts';

export class SystemLogsServiceApi {
  /**
   * Получает все записи системного лога с пагинацией.
   * @param paginationParams - Параметры пагинации (страница и лимит).
   * @returns Объект с пагинированными записями системного лога.
   */
  static async getAllLogs({
    limit = PAGE_SIZE_DEFAULT,
    page = 1,
  }: PaginationParams = {}) {
    return axiosInstance
      .get<PaginationParams, AxiosResponse<PaginatedResponse<schema.SystemLogSelect & {
        user?: schema.UserSelect | null
      }>>>(
        `/api/system-logs/all`,
        {
          params: {
            limit,
            page,
          },
        },
      )
      .then(({ data }) => data);
  }

  /**
   * Экспортирует записи системного лога в CSV формате.
   * @param paginationParams - Параметры пагинации (страница и лимит).
   * @returns Blob с CSV данными.
   */
  static async exportLogs({
    limit = 1000,
    page = 1,
  }: PaginationParams = {}) {
    return axiosInstance
      .get<PaginationParams, AxiosResponse<Blob>>(
        `/api/system-logs/export`,
        {
          params: {
            limit,
            page,
          },
          responseType: 'blob',
        },
      )
      .then(({ data }) => data);
  }
}
