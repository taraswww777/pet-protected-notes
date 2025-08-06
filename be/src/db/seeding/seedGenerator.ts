import { db } from '../client';
import { PgTableWithColumns } from 'drizzle-orm/pg-core';

interface SeedGeneratorParams<TEntity> {
  generateMockEntitiesItem: () => Promise<TEntity>;
  schemaTable: PgTableWithColumns<any>;
  countGeneratedEntities?: number;
  title: string;
  needClearTable?: boolean;
}

export const seedGenerator = async <TEntity>({
  generateMockEntitiesItem,
  schemaTable,
  countGeneratedEntities = 10,
  title,
  needClearTable = false,
}: SeedGeneratorParams<TEntity>) => {
  try {
    console.log(`Starting ${title} seed...`);

    // Очистка таблицы
    if (needClearTable) {
      console.log(`🗑️ ${title} table cleared`);
      await db.delete(schemaTable).execute();
    }

    // Генерация данных
    const mockEntities: TEntity[] = [];
    for (let i = 0; i < countGeneratedEntities; i++) {
      mockEntities.push(await generateMockEntitiesItem());
    }

    // Вставка данных
    await db.insert(schemaTable).values(mockEntities);
    console.log(`✅ ${title} seed completed! Inserted ${mockEntities.length} ${title}.`);
  } catch (error) {
    console.error(`❌ ${title} seed failed:`, error);
    process.exit(1);
  }
};




