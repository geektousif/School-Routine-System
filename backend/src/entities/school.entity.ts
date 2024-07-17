import { Entity, OneToOne, Property } from '@mikro-orm/core';

import { BaseEntity } from '../common/base.entity';
import { User } from './user.entity';

@Entity()
export class School extends BaseEntity {
  @Property()
  name!: string;

  @Property()
  address!: string;

  @OneToOne(() => User, (user) => user.school, { nullable: true })
  admin!: User;

  @Property()
  phoneNumber!: number;

  // @OneToMany(() => User, (user) => user.school)
  // users = new Collection<User>(this);
}
