import createApp from './app';
import { initORM } from './config/db.config';
import { env } from './config/env.config';
import config from './config/mikro-orm.config';

(async () => {
  const db = await initORM({ ...config });

  await db.orm.migrator.up();

  const app = await createApp(db);

  app.listen(env.PORT, () => {
    console.log(`Listening on port ${env.PORT}`);
  });

  process.on('SIGINT', () => {
    db.orm.close();
  });
})();
