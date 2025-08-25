import { FastifyReply, FastifyRequest } from 'fastify';
import { RoleService } from './role.service';
import type {
  AssignRoleToUserBody,
  UpdatePermissionBody,
  CheckPermissionParams
} from './role.types';
import { PaginationParams } from 'protected-notes-common/src/types/Paginate';

export class RoleController {
  constructor(private readonly roleService: RoleService) {
  }

  async removeAllRolesFromAction(
    request: FastifyRequest<{ Params: { actionId: number } }>,
    reply: FastifyReply
  ) {
    try {
      await this.roleService.removeAllRolesFromAction(request.params.actionId);
      return reply.send({ success: true });
    } catch (error) {
      return reply.code(400).send({ error: (error as Error).message });
    }
  }

  async addRolesToAction(
    request: FastifyRequest<{
      Params: { actionId: number },
      Body: { roleIds: number[] }
    }>,
    reply: FastifyReply
  ) {
    try {
      await this.roleService.addRolesToAction(
        request.params.actionId,
        request.body.roleIds
      );
      return reply.send({ success: true });
    } catch (error) {
      return reply.code(400).send({ error: (error as Error).message });
    }
  }

  async removeRoleFromAction(
    request: FastifyRequest<{ Params: { actionId: number, roleId: number } }>,
    reply: FastifyReply
  ) {
    try {
      await this.roleService.removeRoleFromAction(
        request.params.actionId,
        request.params.roleId
      );
      return reply.send({ success: true });
    } catch (error) {
      return reply.code(400).send({ error: (error as Error).message });
    }
  }

  async deleteRole(
    request: FastifyRequest<{ Params: { id: number } }>,
    reply: FastifyReply
  ) {
    try {
      await this.roleService.deleteRole(request.params.id);
      return reply.send({ success: true });
    } catch (error) {
      return reply.code(400).send({ error: (error as Error).message });
    }
  }

  async getUsers(
    request: FastifyRequest<{ Querystring: PaginationParams }>, // Добавляем типизацию query string
    reply: FastifyReply
  ) {
    try {
      // Извлекаем параметры пагинации из запроса
      const page = request.query.page ? +request.query.page : undefined;
      const limit = request.query.limit ? +request.query.limit : undefined;

      // Передаем параметры в сервис
      const users = await this.roleService.getUsers({ page, limit });
      return reply.send(users);
    } catch (error) {
      return reply.code(500).send({ error });
    }
  }


  async getRoles(_request: FastifyRequest, reply: FastifyReply) {
    try {
      const roles = await this.roleService.getRoles();
      return reply.send(roles);
    } catch (error) {
      return reply.code(500).send({ error: 'Failed to get roles' });
    }
  }

  async getUsersCountByRoles(
    request: FastifyRequest<{ Querystring: { roleIds: number[] } }>,
    reply: FastifyReply
  ) {
    try {
      const counts = await this.roleService.getUsersCountByRoles(request.query.roleIds);
      return reply.send(counts);
    } catch (error) {
      console.log('error:', error)
      return reply.code(500).send({ error: 'Failed to get users count' });
    }
  }

  async createRole(request: FastifyRequest<{ Body: { name: string; description?: string } }>, reply: FastifyReply) {
    try {
      const role = await this.roleService.createRole(request.body);
      return reply.send(role);
    } catch (error) {
      return reply.code(500).send({ error: 'Failed to create role' });
    }
  }

  async updateRole(
    request: FastifyRequest<{
      Params: { id: number },
      Body: { name: string; description?: string }
    }>,
    reply: FastifyReply
  ) {
    try {
      const role = await this.roleService.updateRole(
        request.params.id,
        request.body
      );
      return reply.send(role);
    } catch (error) {
      return reply.code(500).send({ error: 'Failed to update role' });
    }
  }

  async assignRole(request: FastifyRequest<{ Body: AssignRoleToUserBody }>, reply: FastifyReply) {
    try {
      await this.roleService.assignRoleToUser(request.body);
      return reply.send({ success: true });
    } catch (error) {
      return reply.code(500).send({ error: 'Failed to assign role' });
    }
  }

  async updatePermission(request: FastifyRequest<{ Body: UpdatePermissionBody }>, reply: FastifyReply) {
    try {
      await this.roleService.updatePermission(request.body);
      return reply.send({ success: true });
    } catch (error) {
      return reply.code(500).send({ error: 'Failed to update permission' });
    }
  }

  async checkPermission(request: FastifyRequest<{ Params: CheckPermissionParams }>, reply: FastifyReply) {
    try {
      const hasAccess = await this.roleService.checkPermission(request.params);
      return reply.send({ hasAccess });
    } catch (error) {
      return reply.code(500).send({ error: 'Failed to check permission' });
    }
  }

  async getActionsWithRoles(_request: FastifyRequest, reply: FastifyReply) {
    try {
      const actions = await this.roleService.getActionsWithRoles();
      return reply.send(actions);
    } catch (error) {
      return reply.code(500).send({ error: 'Failed to get actions with roles' });
    }
  }
}
