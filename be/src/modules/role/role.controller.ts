import { FastifyReply, FastifyRequest } from 'fastify';
import { RoleService } from './role.service';
import type {
  AssignRoleToUserBody,
  UpdatePermissionBody,
  CheckPermissionParams
} from './role.types';

export class RoleController {
  constructor(private readonly roleService: RoleService) {
  }

  async createRole(request: FastifyRequest<{ Body: { name: string; description?: string } }>, reply: FastifyReply) {
    try {
      const role = await this.roleService.createRole(request.body);
      return reply.send(role);
    } catch (error) {
      return reply.code(500).send({ error: 'Failed to create role' });
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
}
