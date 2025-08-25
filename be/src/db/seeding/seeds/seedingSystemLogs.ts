import { schema } from '../../index';
import { seedGenerator } from '../seedGenerator';
import { seedingConfig } from '../seedingConfig';
import { faker } from '@faker-js/faker';
import { LogLevel } from '../../schemas';

const entities: schema.SystemLogInsert[] = [];

// Генерируем моковые логи
for (let i = 1; i <= seedingConfig.countSystemLogs; i++) {
  const logLevels = Object.values(LogLevel);
  const eventTypes = [
    'auth/login',
    'auth/register',
    'user/update',
    'note/create',
    'note/update',
    'note/delete',
    'role/assign',
    'permission/update'
  ];

  entities.push({
    userId: faker.number.int({ min: 1, max: seedingConfig.countUsers }),
    logLevel: faker.helpers.arrayElement(logLevels),
    attemptTime: faker.date.recent({ days: 30 }),
    eventType: faker.helpers.arrayElement(eventTypes),
    metadata: {
      ip: faker.internet.ip(),
      userAgent: faker.internet.userAgent(),
      timestamp: new Date().toISOString()
    },
    data: {
      details: faker.lorem.sentence(),
      success: faker.datatype.boolean(),
      ...(faker.datatype.boolean() && { error: faker.lorem.words(3) })
    }
  });
}

let counter = 0;

const generateMock = async (): Promise<schema.SystemLogInsert> => {
  const result = entities[counter];
  counter++;
  return result;
};

// Основная функция сидинга
export const seedingSystemLogs = () => seedGenerator<schema.SystemLogInsert>({
  generateMockEntitiesItem: generateMock,
  schemaTable: schema.systemLogs,
  countGeneratedEntities: entities.length,
  title: 'seedingSystemLogs',
  needClearTable: true
});
