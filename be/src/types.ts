export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export type RequestWithQuery<TQuery> = {
  Querystring: TQuery
}

export type RequestWithBody<TBody> = {
  Body: TBody
}

export type WithId = {
  id: string;
}

export type RouteWithPagination = RequestWithQuery<PaginationParams>

