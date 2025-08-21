import { schema } from '../../index';
import { seedGenerator } from '../seedGenerator';
import { faker } from '@faker-js/faker';


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
    code: faker.word.noun({ length: { min: 5, max: 25 } }),
    description: faker.lorem.paragraphs({ min: 1, max: 3 }),
    parentId,
  };
};

// Основная функция сидинга
export const seedingActions = () => seedGenerator<schema.ActionsInsert>({
  generateMockEntitiesItem: generateMock,
  schemaTable: schema.actions,
  countGeneratedEntities: 20,
  title: 'seedingActions',
  needClearTable: true
});
