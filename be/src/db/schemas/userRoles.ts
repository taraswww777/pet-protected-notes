import { integer, pgTable, serial, timestamp } from "drizzle-orm/pg-core";
import { roles } from './roles';
import { users } from './users';

export const userRoles = pgTable('user_roles', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  roleId: integer('role_id').references(() => roles.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type UserRolesSelect = typeof userRoles.$inferSelect;
export type UserRolesInsert = typeof userRoles.$inferInsert;
