import { RequestContext } from '@mikro-orm/postgresql';
import express from 'express';

import { readyControllers } from './config/container.config';
import { Services } from './config/db.config';
import { errorHandler } from './middlewares/errorHandler.middleware';
import routes from './routes';

const createApp = async (db: Services) => {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const controllers = readyControllers(db);
  const appRoutes = routes(controllers);

  app.use((req, res, next) => RequestContext.create(db.em, next));
  app.use('/api', appRoutes);

  app.use(errorHandler);

  return app;
};

//TODO logger

export default createApp;
