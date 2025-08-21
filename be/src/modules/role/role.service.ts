import { db, schema } from '../../db';
import { and, eq, inArray, sql } from 'drizzle-orm';
import type { AssignRoleToUserBody, CheckPermissionParams, UpdatePermissionBody } from './role.types';
import { actions, ActionsInsert, rolePermissions, roles, RolesInsert, userRoles } from '../../db/schemas';
import { PaginatedResponse, PaginationParams } from 'protected-notes-common/src/types/Paginate';
import { PaginationUtils } from '../../utils/PaginationUtils';
import { PermissionCacheManager } from '../../services/PermissionCacheManager';

export interface UserWithRolesDTO {
  userId: number;
  login: string;
  roleIds: number[]
}

export class RoleService {
  private permissionCache = PermissionCacheManager.getInstance();

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

    const baseQuery = db
      .select({
        userId: schema.users.id,
        login: schema.users.login,
        roleIds: sql<number[]>`array(
            select ${schema.userRoles.roleId} 
            from ${schema.userRoles} 
            where ${schema.userRoles.userId} = ${schema.users}.${schema.users.id}
          )`.as('roleIds')
      })
      .from(schema.users);

    const countQuery = db
      .select({ count: sql<number>`count(*)` })
      .from(schema.users);

    return await PaginationUtils.paginate<UserWithRolesDTO>({
      baseQuery,
      countQuery,
      paginationParams
    });
  }

  /**
   * Проверяет, есть ли пользователи с заданной ролью.
   *
   * @param {number} roleId - Идентификатор роли, которую нужно проверить.
   *
   * @returns {Promise<boolean>} - Возвращает `true`, если существует хотя бы один пользователь с указанной ролью, иначе `false`.
   */
  async hasUsersWithRoleId(roleId: number): Promise<boolean> {
    const usersWithRoleCount = await db.select({
      count: sql<number>`count(*)`
    })
      .from(userRoles)
      .where(eq(userRoles.roleId, roleId))
      .limit(1)
      .execute();

    return usersWithRoleCount[0].count > 0;
  }

  async deleteRole(roleId: number) {
    // Проверяем, есть ли пользователи с этой ролью
    const hasUsersWithRoleId = await this.hasUsersWithRoleId(roleId);

    if (hasUsersWithRoleId) {
      throw new Error('Cannot delete role: role is assigned to one or more users');
    }

    return await db.transaction(async (tx) => {
      // Получаем список действий, связанных с данной ролью
      const actionItems = await tx.select({
        code: actions.code
      })
        .from(actions)
        .innerJoin(rolePermissions, eq(rolePermissions.actionId, actions.id))
        .where(eq(rolePermissions.roleId, roleId)).execute().then(results => results.map(item => item.code));

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
      this.permissionCache.clearPermissionByActionCode(actionItems);

      return result[0];
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

  async checkPermission({ userId, actionCode }: CheckPermissionParams) {
    // Проверка кэша
    if (this.permissionCache.hasPermission(userId, actionCode)) {
      return this.permissionCache.getPermission(userId, actionCode);
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


    this.permissionCache.setPermissions(userId, { [actionCode]: result.length > 0 });

    return result.length > 0;
  }

  async getUserRoles(userId: number) {
    return db.select()
      .from(userRoles)
      .innerJoin(roles, eq(roles.id, userRoles.roleId))
      .where(eq(userRoles.userId, userId));
  }

  async getActionsWithRoles() {
    const result = await db
      .select({
        id: actions.id,
        code: actions.code,
        name: actions.name,
        description: actions.description,
        parentId: actions.parentId,
        roleIds: sql<number[]>`array_agg(distinct ${rolePermissions.roleId})`.as('roleIds')
      })
      .from(actions)
      .leftJoin(rolePermissions, eq(rolePermissions.actionId, actions.id))
      .groupBy(actions.id, actions.code, actions.name, actions.description, actions.parentId)
      .orderBy(actions.id);

    return result.map(item => ({
      ...item,
      roleIds: item.roleIds.filter(roleId => roleId !== null) // Убираем null из массива
    }));
  }
}
