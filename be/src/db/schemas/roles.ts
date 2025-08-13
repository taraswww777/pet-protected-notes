import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const roles = pgTable('roles', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).unique().notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type RolesSelect = typeof roles.$inferSelect;
export type RolesInsert = Omit<typeof roles.$inferInsert, 'id' | 'createdAt' | 'updatedAt'>;
