import express from "express";
import "dotenv/config";
import http from "http";
import mikroOrmConfig from "./config/mikro-orm.config";
import {
  MikroORM,
  EntityManager,
  EntityRepository,
  RequestContext,
} from "@mikro-orm/core";
import { env } from "process";
import { User } from "./entity/user.entity";
import { School } from "./entity/school.entity";
import UserController from "./controller/user.controller";
import cookieParser from "cookie-parser";
import errorHandler from "./utils/errorHandler";

export const DI = {} as {
  server: http.Server;
  orm: MikroORM;
  em: EntityManager;
  userRepo: EntityRepository<User>;
  schoolRepo: EntityRepository<School>;
};

(async () => {
  const app = express();

  DI.orm = await MikroORM.init(mikroOrmConfig);
  DI.em = DI.orm.em;

  await DI.orm.migrator.up();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  DI.userRepo = DI.orm.em.getRepository(User);
  DI.schoolRepo = DI.orm.em.getRepository(School);

  app.use((req, res, next) => {
    RequestContext.create(DI.orm.em, next);
  });

  app.use("/api/user", UserController);

  app.use(errorHandler);

  DI.server = app.listen(env.PORT, () => {
    console.log(`Listening on port ${env.PORT}`);
  });

  process.on("SIGINT", () => {
    DI.server.close();
  });
})();
