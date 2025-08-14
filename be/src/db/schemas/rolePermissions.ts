import { boolean, integer, pgTable, serial, timestamp } from "drizzle-orm/pg-core";
import { actions } from './actions';
import { roles } from './roles';


export const rolePermissions = pgTable('role_permissions', {
  id: serial('id').primaryKey(),
  roleId: integer('role_id').references(() => roles.id, { onDelete: 'cascade' }).notNull(),
  actionId: integer('action_id').references(() => actions.id, { onDelete: 'cascade' }).notNull(),
  isAllowed: boolean('is_allowed').default(true).notNull(), // Можно запрещать конкретные действия
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type RolePermissionsSelect = typeof rolePermissions.$inferSelect;
export type RolePermissionsInsert = typeof rolePermissions.$inferInsert;
