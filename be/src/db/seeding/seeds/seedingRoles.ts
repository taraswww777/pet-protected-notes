import { schema } from '../../index';
import { seedGenerator } from '../seedGenerator';
import { seedingConfig } from '../seedingConfig';
import { faker } from '@faker-js/faker';
import { getUniqWord } from '../utils/getUniqWord';

const entities: schema.RolesInsert[] = [
  { name: 'Администратор', description: 'Полный доступ' },
  { name: 'Пользователь', description: 'Базовые права' },
];

if (entities.length < seedingConfig.countRoles) {
  for (let roleId = (entities.length+1); roleId <= seedingConfig.countRoles; roleId++) {
    entities.push({
      name: getUniqWord(),
      description: faker.lorem.paragraphs({ min: 1, max: 3 })
    });
  }
}

let counter = 0;

const generateMock = async (): Promise<schema.RolesInsert> => {
  const result = entities[counter];
  counter++;

  return result;
};

// Основная функция сидинга
export const seedingRoles = () => seedGenerator<schema.RolesInsert>({
  generateMockEntitiesItem: generateMock,
  schemaTable: schema.roles,
  countGeneratedEntities: entities.length,
  title: 'Roles',
  needClearTable: true
});
