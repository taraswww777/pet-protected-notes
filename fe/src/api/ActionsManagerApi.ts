import { schema } from 'protected-notes-be/src/db/index.ts';
import { axiosInstance } from './asiosInstanse.ts';
import { AxiosResponse } from 'axios';

export interface ActionWithRoles extends schema.ActionsSelect {
  roleIds: schema.RolePermissionsSelect['roleId'][];
}

export class ActionManagerApi {
  static getActions() {
    return axiosInstance
      .get<never, AxiosResponse<ActionWithRoles[]>>('/api/roles/actions/with-roles')
      .then(({ data }) => data);
  }
}
