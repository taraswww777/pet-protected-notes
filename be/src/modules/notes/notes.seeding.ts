import { faker } from '@faker-js/faker';
import { db, schema } from '../../db';

const generateMockNotesItem = (): schema.NoteInsertDTO => ({
  title: faker.lorem.sentence({ min: 2, max: 5 }),       // Пример: "How to learn Drizzle ORM"
  content: faker.lorem.paragraphs({ min: 1, max: 3 }),  // Пример: "Drizzle is a modern ORM..."
})

// Функция для генерации тестовых заметок
const generateMockNotes = (count: number): schema.NoteInsertDTO[] => {
  return Array.from({ length: count }, generateMockNotesItem);
};

// Основная функция сидинга
export async function seedingNotes(countAddItems: number = 10, needClearTable = false): Promise<void> {
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
      await db.delete(schema.notes).execute();
    }

    // Вставка 10 тестовых заметок
    const mockNotes = generateMockNotes(countAddItems);
    await db.insert(schema.notes).values(mockNotes);

    console.log('✅ Seed completed! Inserted', mockNotes.length, 'notes.')
  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  }
}

