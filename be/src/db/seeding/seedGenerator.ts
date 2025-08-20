import { db } from '../client';
import { PgTableWithColumns } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

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
    console.log(`🌱 Starting seed for: ${title}`);
    console.log(`📊 Expected entities: ${countGeneratedEntities}`);

    // Очистка таблицы
    if (needClearTable) {
      console.log(`🧹 Clearing table: ${title}...`);
      await db.execute(sql`TRUNCATE TABLE ${schemaTable} RESTART IDENTITY CASCADE`);
      console.log(`✅ Table cleared successfully: ${title}`);
    } else {
      console.log(`⏭️  Table clearing skipped for: ${title}`);
    }

    // Генерация данных
    console.log(`🔄 Generating mock data for: ${title}...`);
    const mockEntities: TEntity[] = [];

    for (let i = 0; i < countGeneratedEntities; i++) {
      const progress = Math.round(((i + 1) / countGeneratedEntities) * 100);
      if (progress % 20 === 0 || i === countGeneratedEntities - 1) {
        console.log(`📈 Generation progress: ${progress}% (${i + 1}/${countGeneratedEntities})`);
      }
      mockEntities.push(await generateMockEntitiesItem());
    }

    // Вставка данных
    console.log(`💾 Inserting ${mockEntities.length} entities into: ${title}...`);
    await db.insert(schemaTable).values(mockEntities);

    console.log(`🎉 Successfully seeded: ${title}`);
    console.log(`✅ Inserted: ${mockEntities.length} entities`);
    console.log('─'.repeat(50));
  } catch (error) {
    console.error(`❌ Seed failed for: ${title}`);
    console.error(`🔴 Error:`, error);
    console.log('─'.repeat(50));
    process.exit(1);
  }
};
