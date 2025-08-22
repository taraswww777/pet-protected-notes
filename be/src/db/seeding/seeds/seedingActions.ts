import { schema } from '../../index';
import { seedGenerator } from '../seedGenerator';
import { faker } from '@faker-js/faker';
import { seedingConfig } from '../seedingConfig';
import { getUniqWord } from '../utils/getUniqWord';


let maxParentId = 0;

const generateMock = async (): Promise<schema.ActionsInsert> => {
  let parentId: schema.ActionsInsert['parentId'] = undefined;

  const hasParentId = faker.datatype.boolean();

  if (hasParentId && Boolean(maxParentId)) {
    parentId = faker.number.int({ min: 1, max: maxParentId });
  }

  maxParentId++;

  return {
    name: faker.lorem.sentence({ min: 2, max: 5 }),
    code: getUniqWord(),
    description: faker.lorem.paragraphs({ min: 1, max: 3 }),
    parentId,
  };
};

// Основная функция сидинга
export const seedingActions = () => seedGenerator<schema.ActionsInsert>({
  generateMockEntitiesItem: generateMock,
  schemaTable: schema.actions,
  countGeneratedEntities: seedingConfig.countActions,
  title: 'seedingActions',
  needClearTable: true
});
