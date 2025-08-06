import { seedingNotes } from './seeds/seedingNotes';
import { seedingUsers } from './seeds/seedingUsers';

export const runSeeding = async () => {

// в этот массив складываем функции которые выполнят seeding данных в БД
  const seeds = [
    seedingUsers,
    seedingNotes,
  ];

  for (const seed of seeds) {
    await seed();
  }
};
