export type RequestWithQuery<TQuery> = {
  Querystring: TQuery
}

export type RequestWithBody<TBody> = {
  Body: TBody
}

export type WithId = {
  id: string;
}
