export interface AssignRoleToUserBody {
  userId: number;
  roleIds: number[];
}

export interface UpdatePermissionBody {
  roleId: number;
  actionId: number;
  isAllowed: boolean;
}

export interface CheckPermissionParams {
  userId: number;
  actionCode: string;
}
