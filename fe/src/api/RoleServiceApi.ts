import { axiosInstance } from './asiosInstanse.ts';
import {
  AssignRoleToUserBody,
  UpdatePermissionBody,
  CheckPermissionParams,
} from 'protected-notes-be/src/modules/role/role.types.ts';
import { AxiosResponse } from 'axios';
import { schema } from 'protected-notes-be/src/db/index.ts';
import { PAGE_SIZE_DEFAULT } from '../constants/common.ts';
import { PaginatedResponse, PaginationParams } from 'protected-notes-common/src/types/Paginate';
import { UserWithRolesDTO } from 'protected-notes-be/src/modules/role';

export class RoleServiceApi {
  static createRole(body: { name: string; description?: string }) {
    return axiosInstance.post('/api/roles/roles', body);
  }

  static updateRole(id: number, body: { name: string; description?: string }) {
    return axiosInstance.put(`/api/roles/roles/${id}`, body);
  }

  static assignRole(body: AssignRoleToUserBody) {
    return axiosInstance.post('/api/roles/roles/assign', body);
  }

  static updatePermission(body: UpdatePermissionBody) {
    return axiosInstance.put('/api/roles/roles/permissions', body);
  }

  static checkPermission(params: CheckPermissionParams) {
    return axiosInstance.get(`/api/roles/permissions/check/${params.userId}/${params.actionCode}`);
  }

  static getRoles() {
    return axiosInstance.get<never, AxiosResponse<schema.RolesSelect[]>>('/api/roles/roles').then(({ data }) => data);
  }

  static getUsersCountByRoles(roleIds: number[]) {
    return axiosInstance.get<never, AxiosResponse<Array<{
      roleId: number,
      userCount: number
    }>>>('/api/roles/roles/users-count', {
      params: { roleIds },
    }).then(({ data }) => data);
  }

  static deleteRole(id: number) {
    return axiosInstance.delete(`/api/roles/roles/${id}`);
  }

  static getUsers({
    limit = PAGE_SIZE_DEFAULT,
    page = 1,
  }: PaginationParams) {
    return axiosInstance
      .get<never, AxiosResponse<PaginatedResponse<UserWithRolesDTO>>>(
        '/api/roles/users',
        { params: { limit, page } },
      )
      .then(({ data }) => data);
  }
}
