import { FastifyInstance } from 'fastify';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { middlewareVerifyJWT } from '../auth';
import { AssignRoleToUserBody, CheckPermissionParams, UpdatePermissionBody } from './role.types';
import { PaginationParams } from 'protected-notes-common/src/types/Paginate';

export async function roleRoutes(server: FastifyInstance) {
  const controller = new RoleController(new RoleService());

  server.get<{ Querystring: PaginationParams }>(
    '/users',
    { preHandler: middlewareVerifyJWT },
    (req, reply) => controller.getUsers(req, reply)
  );

  server.post<{ Body: { name: string; description?: string } }>(
    '/roles',
    { preHandler: middlewareVerifyJWT },
    (req, reply) => controller.createRole(req, reply)
  );

  server.put<{ Params: { id: number }, Body: { name: string; description?: string } }>(
    '/roles/:id',
    { preHandler: middlewareVerifyJWT },
    (req, reply) => controller.updateRole(req, reply)
  );

  server.get<{ Querystring: { roleIds: number[] } }>(
    '/roles/users-count',
    { preHandler: middlewareVerifyJWT },
    (req, reply) => controller.getUsersCountByRoles(req, reply)
  );

  server.delete<{ Params: { id: number } }>(
    '/roles/:id',
    { preHandler: middlewareVerifyJWT },
    (req, reply) => controller.deleteRole(req, reply)
  );

  // Новый маршрут для получения списка ролей
  server.get(
    '/roles',
    { preHandler: middlewareVerifyJWT },
    (req, reply) => controller.getRoles(req, reply)
  );

  server.post<{ Body: AssignRoleToUserBody }>(
    '/roles/assign',
    { preHandler: middlewareVerifyJWT },
    (req, reply) => controller.assignRole(req, reply)
  );

  server.put<{ Body: UpdatePermissionBody }>(
    '/roles/permissions',
    { preHandler: middlewareVerifyJWT },
    (req, reply) => controller.updatePermission(req, reply)
  );

  server.get<{ Params: CheckPermissionParams }>(
    '/permissions/check/:userId/:actionCode',
    { preHandler: middlewareVerifyJWT },
    (req, reply) => controller.checkPermission(req, reply)
  );
}
