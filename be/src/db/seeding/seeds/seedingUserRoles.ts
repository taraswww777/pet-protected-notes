import { schema } from '../../index';
import { seedGenerator } from '../seedGenerator';
import { faker } from '@faker-js/faker';
import { seedingConfig } from '../seedingConfig';

const entities: schema.UserRolesInsert[] = [];

for (let userId = 1; userId <= seedingConfig.countUsers; userId++) {
  const roles = [];

  for (let roleId = 1; roleId <= seedingConfig.countRoles; roleId++) {
    if (faker.datatype.boolean()) {
      roles.push(roleId);
    }
  }

  if (roles.length === 0) {
    roles.push(faker.number.int({ min: 1, max: seedingConfig.countRoles }));
  }

  roles.forEach(roleId => {
    entities.push({ userId, roleId });
  });
}


let counter = 0;

const generateMock = async (): Promise<schema.UserRolesInsert> => {
  const result = entities[counter];
  counter++;

  return result;
};

// Основная функция сидинга
export const seedingUserRoles = () => seedGenerator<schema.UserRolesInsert>({
  generateMockEntitiesItem: generateMock,
  schemaTable: schema.userRoles,
  countGeneratedEntities: entities.length,
  title: 'seedingUserRoles',
  needClearTable: true
});
