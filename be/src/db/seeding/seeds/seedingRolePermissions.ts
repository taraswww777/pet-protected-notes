import { schema } from '../../index';
import { seedGenerator } from '../seedGenerator';
import { faker } from '@faker-js/faker';

const countRoles = 2;
const countActions = 20;

const entities: schema.RolePermissionsInsert[] = [];

for (let roleId = 1; roleId <= countRoles; roleId++) {
  for (let actionId = 1; actionId <= countActions; actionId++) {
    entities.push({
      roleId,
      actionId,
      isAllowed: faker.datatype.boolean()
    });
  }
}

let counter = 0;

const generateMock = async (): Promise<schema.RolePermissionsInsert> => {
  const result = entities[counter];
  counter++;

  return result;
};

// Основная функция сидинга
export const seedingRolePermissions = () => seedGenerator<schema.RolePermissionsInsert>({
  generateMockEntitiesItem: generateMock,
  schemaTable: schema.rolePermissions,
  countGeneratedEntities: entities.length,
  title: 'RolePermissions',
  needClearTable: true
});
