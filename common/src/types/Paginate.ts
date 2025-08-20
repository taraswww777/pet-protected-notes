/**
 * Интерфейс для отклика с постраничной разбивкой.
 * @template T - Тип элементов в массиве items.
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  countItems: number;
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/**
 * Интерфейс для параметров пагинации.
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

/**
 * Тип для запроса с параметрами в строке запроса.
 * @template TQuery - Тип объекта параметров запроса.
 */
export type RequestWithQuery<TQuery> = {
  Querystring: TQuery
}

/**
 * Тип для маршрута с параметрами пагинации.
 */
export type RouteWithPagination = RequestWithQuery<PaginationParams>
