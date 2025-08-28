import { integer, pgTable, varchar } from 'drizzle-orm/pg-core';
import { users } from './users';

/** Схема таблицы `userInfo` */
export const userInfo = pgTable('userInfo', {
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  firstName: varchar('first_name'),
  secondName: varchar('second_name'),
  thirdName: varchar('third_name'),
});


