import { Collection, Entity, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';

import { User } from './user.entity';

@Entity()
export class School {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  id!: string;

  @Property()
  name!: string;

  @Property()
  address!: string;

  @OneToMany(() => User, (user) => user.school)
  users = new Collection<User>(this);
}
