export interface AssignRoleToUserBody {
  userId: number;
  roleId: number;
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
