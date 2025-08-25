import { faker } from '@faker-js/faker';
import { schema } from '../../index';
import { hashingPassword } from '../../../modules/auth';
import { seedGenerator } from '../seedGenerator';
import { seedingConfig } from '../seedingConfig';

const systemUserLogin = 'taraswww777@mail.ru';
let setedSystemUserLogin = false;

// Реализация для пользователей
const generateMockUser = async (): Promise<schema.UserInsertDTO> => {
  let login = faker.internet.email();

  if (!setedSystemUserLogin) {
    login = systemUserLogin;
    setedSystemUserLogin = true;
  }

  return ({
    login,
    password: await hashingPassword('!q12345678'),
  });
};

export const seedingUsers = () => seedGenerator<schema.UserInsertDTO>({
  generateMockEntitiesItem: generateMockUser,
  schemaTable: schema.users,
  countGeneratedEntities: seedingConfig.countUsers,
  title: 'Users',
  needClearTable: true
});
