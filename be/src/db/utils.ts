import { pgEnum } from 'drizzle-orm/pg-core';

/**
 * Преобразует TypeScript-объект в формате { KEY: value } в pgEnum для Drizzle ORM
 * @param name - Название enum в базе данных
 * @param tsEnum - TypeScript-объект с enum значениями
 * @returns Готовый pgEnum для использования в схемах Drizzle
 */
export function enumToPgEnum<T extends Record<string, string>>(
  name: string,
  tsEnum: T,
) {
  const values = Object.values(tsEnum) as [string, ...string[]];

  return pgEnum(name, values);
}
