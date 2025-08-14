import { db } from '../../db';
import { eq, and } from 'drizzle-orm';
import type { AssignRoleToUserBody, UpdatePermissionBody, CheckPermissionParams } from './role.types';
import { roles, actions, rolePermissions, userRoles, ActionsInsert, RolesInsert } from '../../db/schemas';

export class RoleService {
  // Роли
  async createRole(params: RolesInsert) {
    const [role] = await db.insert(roles)
      .values(params)
      .returning();

    return role;
  }

  async deleteRole(roleId: number) {
    await db.delete(roles).where(eq(roles.id, roleId)).execute();
  }

  // Действия
  async createAction(params: ActionsInsert) {
    await db.insert(actions)
      .values(params)
      .execute();
  }

  // Права
  async updatePermission({ roleId, actionId, isAllowed }: UpdatePermissionBody) {
    const existing = await db.select()
      .from(rolePermissions)
      .where(and(
        eq(rolePermissions.roleId, roleId),
        eq(rolePermissions.actionId, actionId)
      ))
      .limit(1);

    if (existing.length) {
      await db.update(rolePermissions)
        .set({ isAllowed })
        .where(and(
          eq(rolePermissions.roleId, roleId),
          eq(rolePermissions.actionId, actionId)
        ));
    } else {
      await db.insert(rolePermissions)
        .values({ roleId, actionId, isAllowed });
    }
  }

  // Пользователи
  async assignRoleToUser({ userId, roleId }: AssignRoleToUserBody) {
    await db.insert(userRoles).values({ userId, roleId });
  }

  // В RoleService
  private permissionCache = new Map<number, Map<string, boolean>>();


  async checkPermission({ userId, actionCode }: CheckPermissionParams) {
    // Проверка кэша
    if (this.permissionCache.has(userId)) {
      const userCache = this.permissionCache.get(userId)!;
      if (userCache.has(actionCode)) {
        return userCache.get(actionCode)!;
      }
    }

    const result = await db.select()
      .from(userRoles)
      .innerJoin(rolePermissions, eq(rolePermissions.roleId, userRoles.roleId))
      .innerJoin(actions, eq(actions.id, rolePermissions.actionId))
      .where(and(
        eq(userRoles.userId, userId),
        eq(actions.code, actionCode),
        eq(rolePermissions.isAllowed, true)
      ))
      .limit(1);

    // Сохранение в кэш
    if (!this.permissionCache.has(userId)) {
      this.permissionCache.set(userId, new Map());
    }
    this.permissionCache.get(userId)!.set(actionCode, result.length > 0);

    return result.length > 0;
  }

  async getUserRoles(userId: number) {
    return db.select()
      .from(userRoles)
      .innerJoin(roles, eq(roles.id, userRoles.roleId))
      .where(eq(userRoles.userId, userId));
  }
}
