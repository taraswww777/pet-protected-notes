import { faker } from '@faker-js/faker';
import { db, schema } from '../../index';
import { seedGenerator } from '../seedGenerator';

const generateMockNote = async (): Promise<schema.NoteInsertDTO> => ({
  title: faker.lorem.sentence({ min: 2, max: 5 }),
  content: faker.lorem.paragraphs({ min: 1, max: 3 }),
  userId: faker.number.int({ min: 1, max: 10 }),
});

// Основная функция сидинга
export const seedingNotes = () => seedGenerator<schema.NoteInsertDTO>({
  generateMockEntitiesItem: generateMockNote,
  schemaTable: schema.notes,
  countGeneratedEntities: 10,
  title: 'Notes',
});
