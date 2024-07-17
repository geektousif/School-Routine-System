import { EntityManager, EntityRepository, MikroORM, Options } from '@mikro-orm/postgresql';

import { School } from '../entities/school.entity';
import { User } from '../entities/user.entity';
import UserRepository from '../repositories/user.repository';

export interface Services {
  orm: MikroORM;
  em: EntityManager;
  user: UserRepository;
  school: EntityRepository<School>;
}

let cache: Services;

export async function initORM(options?: Options): Promise<Services> {
  if (cache) {
    return cache;
  }

  const orm = await MikroORM.init(options);

  return (cache = {
    orm,
    em: orm.em,
    user: orm.em.getRepository(User),
    school: orm.em.getRepository(School),
  });
}
