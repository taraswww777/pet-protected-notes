import { schema } from '../../index';
import { seedGenerator } from '../seedGenerator';
import { faker } from '@faker-js/faker';
import { seedingConfig } from '../seedingConfig';


const entities: schema.RolePermissionsInsert[] = [];

for (let roleId = 1; roleId <= seedingConfig.countRoles; roleId++) {
  for (let actionId = 1; actionId <= seedingConfig.countActions; actionId++) {
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
