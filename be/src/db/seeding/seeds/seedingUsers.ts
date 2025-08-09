import { faker } from '@faker-js/faker';
import { schema } from '../../index';
import { hashingPassword } from '../../../modules/auth/auth.utils';
import { seedGenerator } from '../seedGenerator';

// Реализация для пользователей
const generateMockUser = async (): Promise<schema.UserInsertDTO> => ({
  login: faker.internet.email(),
  password: await hashingPassword('!q12345678'),
});

export const seedingUsers = () => seedGenerator<schema.UserInsertDTO>({
  generateMockEntitiesItem: generateMockUser,
  schemaTable: schema.users,
  countGeneratedEntities: 10,
  title: 'Users',
});
