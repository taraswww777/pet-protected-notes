import { runSeeding } from './db/seeding';

if (require.main === module) {
  void runSeeding();
}
