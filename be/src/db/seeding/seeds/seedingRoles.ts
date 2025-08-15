import { schema } from '../../index';
import { seedGenerator } from '../seedGenerator';

const roles: schema.RolesInsert[] = [
  { name: 'Администратор', description: 'Полный доступ' },
  { name: 'Пользователь', description: 'Базовые права' },
];

let counter = 0;

const generateMock = async (): Promise<schema.RolesInsert> => {
  const result = roles[counter];
  counter++;

  return result;
};

// Основная функция сидинга
export const seedingRoles = () => seedGenerator<schema.RolesInsert>({
  generateMockEntitiesItem: generateMock,
  schemaTable: schema.roles,
  countGeneratedEntities: 2,
  title: 'Roles',
  needClearTable: true
});
