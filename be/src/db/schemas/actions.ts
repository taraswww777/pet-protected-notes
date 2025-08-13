import { integer, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const actions = pgTable('actions', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).unique().notNull(),
  code: varchar('code', { length: 100 }).unique().notNull(),
  description: text('description'),
  parentId: integer('parent_id').references(() => actions.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type ActionsSelect = typeof actions.$inferSelect;
export type ActionsInsert = typeof actions.$inferInsert;
