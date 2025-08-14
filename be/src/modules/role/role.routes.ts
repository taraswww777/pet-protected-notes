import { FastifyInstance } from 'fastify';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { middlewareVerifyJWT } from '../auth';
import { AssignRoleToUserBody, CheckPermissionParams, UpdatePermissionBody } from './role.types';

export async function roleRoutes(server: FastifyInstance) {
  const controller = new RoleController(new RoleService());

  server.post<{ Body: { name: string; description?: string } }>(
    '/roles',
    { preHandler: middlewareVerifyJWT },
    (req, reply) => controller.createRole(req, reply)
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
