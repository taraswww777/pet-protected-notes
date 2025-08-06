import { faker } from '@faker-js/faker';
import { db, schema } from '../../index';
import { hashingPassword } from '../../../modules/auth/auth.utils';

const generateMockEntitiesItem = async (): Promise<schema.UserInsertDTO> => ({
  login: faker.internet.email(),
  password: await hashingPassword(faker.internet.password()),
});

const generateMockEntities = async (count: number): Promise<schema.UserInsertDTO[]> => {
  const users: schema.UserInsertDTO[] = [];
  for (let i = 0; i < count; i++) {
    users.push(await generateMockEntitiesItem());
  }
  return users;
};

// Основная функция сидинга
export async function seedingUsers(countAddItems: number = 10, needClearTable = false): Promise<void> {
  // Проверяем, что функция запущена напрямую через CLI, а не импортирована как модуль
  // @ts-expect-error этот скрипт должен запускаться только в консоли
  if (import.meta.url && !process.argv.includes('--seed')) {
    console.log('Skipping seed (not running in CLI mode)');
    return;
  }

  try {
    console.log('Starting seed...');

    // Очистка таблицы (опционально)
    if (needClearTable) {
      await db.delete(schema.users).execute();
    }

    // Вставка 10 тестовых заметок
    const mockEntities = await generateMockEntities(countAddItems);
    await db.insert(schema.users).values(mockEntities);

    console.log('✅ Seed completed! Inserted', mockEntities.length, 'users.');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  }
}

