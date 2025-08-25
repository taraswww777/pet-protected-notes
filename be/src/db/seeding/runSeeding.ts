import { seedingNotes } from './seeds/seedingNotes';
import { seedingUsers } from './seeds/seedingUsers';
import { seedingRoles } from './seeds/seedingRoles';
import { seedingUserRoles } from './seeds/seedingUserRoles';
import { seedingActions } from './seeds/seedingActions';
import { seedingRolePermissions } from './seeds/seedingRolePermissions';
import { seedingSystemLogs } from './seeds/seedingSystemLogs';

export const runSeeding = async () => {

// в этот массив складываем функции которые выполнят seeding данных в БД
  const seeds = [
    seedingUsers,
    seedingNotes,
    seedingRoles,
    seedingUserRoles,
    seedingActions,
    seedingRolePermissions,
    seedingSystemLogs,
  ];

  for (const seed of seeds) {
    await seed();
  }
};
