import { faker } from '@faker-js/faker';
import { db, schema } from '../../index';
import { seedGenerator } from '../seedGenerator';
import { seedingConfig } from '../seedingConfig';

const generateMockNote = async (): Promise<schema.NoteInsertDTO> => ({
  title: faker.lorem.sentence({ min: 2, max: 5 }),
  content: faker.lorem.paragraphs({ min: 1, max: 3 }),
  userId: faker.number.int({ min: 1, max: seedingConfig.countUsers }),
});

// Основная функция сидинга
export const seedingNotes = () => seedGenerator<schema.NoteInsertDTO>({
  generateMockEntitiesItem: generateMockNote,
  schemaTable: schema.notes,
  countGeneratedEntities: seedingConfig.countNotes,
  title: 'Notes',
  needClearTable: true
});
