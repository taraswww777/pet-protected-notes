import { runSeeding } from './db/seeding';


// Проверка CLI режима
if (require.main === module) {
  void runSeeding();
} else {
  console.log(`Skipping seed (not running in CLI mode)`);
}
