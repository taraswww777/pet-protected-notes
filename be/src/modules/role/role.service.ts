import { db, schema } from '../../db';
import { and, eq, inArray, sql } from 'drizzle-orm';
import type { AssignRoleToUserBody, CheckPermissionParams, UpdatePermissionBody } from './role.types';
import { actions, ActionsInsert, rolePermissions, roles, RolesInsert, userRoles } from '../../db/schemas';
import { PaginatedResponse, PaginationParams } from 'protected-notes-common/src/types/Paginate';
import { PaginationUtils } from '../../utils/PaginationUtils';

export interface UserWithRolesDTO {
  userId: number;
  login: string;
  roleIds: number[]
}

export class RoleService {
  // Роли
  async createRole(params: RolesInsert) {
    const [role] = await db.insert(roles)
      .values(params)
      .returning();

    return role;
  }

  async getUsers(
    paginationParams?: PaginationParams
  ): Promise<PaginatedResponse<UserWithRolesDTO>> {

    // Базовый запрос для данных
    const baseQuery = db
      .select({
        id: schema.users.id,
        login: schema.users.login,
        roleId: schema.userRoles.roleId,
      })
      .from(schema.users)
      .leftJoin(schema.userRoles, eq(schema.users.id, schema.userRoles.userId));

    // Запрос для подсчета общего количества
    const countQuery = db
      .select({ count: sql<number>`count(*)` })
      .from(schema.users);

    const result = await PaginationUtils.paginate<schema.UserSelect & { roleId?: number }>({
      baseQuery,
      countQuery,
      paginationParams
    });

    // Группируем записи по userId
    const groupedMap = result.items.reduce((map, item) => {
      if (!map.has(item.id)) {
        map.set(item.id, {
          userId: item.id,
          login: item.login,
          roleIds: []
        });
      }
      if (item?.roleId) {
        map.get(item.id)!.roleIds.push(item.roleId);
      }
      return map;
    }, new Map<number, UserWithRolesDTO>());


    return {
      ...result,
      items: Array.from(groupedMap.values())
    };
  }

  async deleteRole(roleId: number) {
    return await db.transaction(async (tx) => {
      // Проверяем, есть ли пользователи с этой ролью
      const usersWithRole = await tx.select()
        .from(userRoles)
        .where(eq(userRoles.roleId, roleId))
        .limit(1);

      if (usersWithRole.length > 0) {
        throw new Error('Cannot delete role: role is assigned to one or more users');
      }

      // Удаляем связанные разрешения
      await tx.delete(rolePermissions)
        .where(eq(rolePermissions.roleId, roleId))
        .execute();

      // Удаляем саму роль
      const result = await tx.delete(roles)
        .where(eq(roles.id, roleId))
        .returning({ id: roles.id })
        .execute();

      if (result.length === 0) {
        throw new Error('Role not found');
      }

      // Очищаем только релевантную часть кэша
      this.clearPermissionCacheForRole(roleId);

      return result[0];
    });
  }

  private clearPermissionCacheForRole(_roleId: number) {
    this.permissionCache.forEach((userCache, _userId) => {
      // Можно добавить более точную очистку, если известно какие actionCode связаны с roleId
      userCache.clear();
    });
  }

  async updateRole(id: number, params: { name: string; description?: string }) {
    const [role] = await db.update(roles)
      .set(params)
      .where(eq(roles.id, id))
      .returning();

    return role;
  }

  async getRoles() {
    return db.select().from(roles);
  }

  async getUsersCountByRoles(roleIds: number[]) {
    if (!roleIds.length) return [];

    return await db.select({
      roleId: userRoles.roleId,
      userCount: sql<number>`count(${userRoles.userId})`
    })
      .from(userRoles)
      .where(inArray(userRoles.roleId, roleIds))
      .groupBy(userRoles.roleId);
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
  async assignRoleToUser({ userId, roleIds }: AssignRoleToUserBody) {
    await db.transaction(async (tx) => {
      // Удаляем все текущие роли пользователя
      await tx.delete(userRoles)
        .where(eq(userRoles.userId, userId))
        .execute();

      // Добавляем новые роли, если они указаны
      if (roleIds.length > 0) {
        await tx.insert(userRoles)
          .values(roleIds.map(roleId => ({ userId, roleId })))
          .execute();
      }

      // Очищаем кэш разрешений для этого пользователя
      this.permissionCache.delete(userId);
    });
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
