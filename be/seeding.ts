import { seedingNotes } from './src/modules/notes/notes.seeding';

// в этот массив складываем функции которые выполнят seeding данных в БД
const seeds = [
  seedingNotes
];

if (require.main === module) {
  seeds.forEach(seed => {
    seed();
  })
}
