import { seedingNotes } from './seeds/seedingNotes';
import { seedingUsers } from './seeds/seedingUsers';
import { seedingRoles } from './seeds/seedingRoles';

export const runSeeding = async () => {

// в этот массив складываем функции которые выполнят seeding данных в БД
  const seeds = [
    seedingUsers,
    seedingNotes,
    seedingRoles,
  ];

  for (const seed of seeds) {
    await seed();
  }
};
