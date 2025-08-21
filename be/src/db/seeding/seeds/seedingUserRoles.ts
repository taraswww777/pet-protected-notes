import { schema } from '../../index';
import { seedGenerator } from '../seedGenerator';

const roles: schema.UserRolesInsert[] = [
  { roleId: 1, userId: 1 },
  { roleId: 2, userId: 1 },
  { roleId: 1, userId: 2 },
  { roleId: 2, userId: 2 },
  { roleId: 1, userId: 3 },
  { roleId: 2, userId: 4 },
];

let counter = 0;

const generateMock = async (): Promise<schema.UserRolesInsert> => {
  const result = roles[counter];
  counter++;

  return result;
};

// Основная функция сидинга
export const seedingUserRoles = () => seedGenerator<schema.UserRolesInsert>({
  generateMockEntitiesItem: generateMock,
  schemaTable: schema.userRoles,
  countGeneratedEntities: roles.length,
  title: 'seedingUserRoles',
  needClearTable: true
});
