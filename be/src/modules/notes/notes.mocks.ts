import { faker } from '@faker-js/faker/locale/ru';
import { NoteDTO } from './notes.types';

export const generateMockNote = (): NoteDTO => {
  return {
    id: faker.number.int({ min: 1, max: 1000 }),
    title: faker.lorem.sentence({ min: 2, max: 5 }),
    content: faker.lorem.paragraphs({ min: 1, max: 3 }),
    createdAt: faker.date.recent().toISOString(),
  };
};

export const generateMockNotes = (count: number = 10): NoteDTO[] => {
  return Array.from({ length: count }, (_, index) => ({
    ...generateMockNote(),
    id: index + 1, // Обеспечиваем уникальные id
  }));
};
