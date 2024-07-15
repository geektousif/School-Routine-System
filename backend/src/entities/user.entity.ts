import { Entity, Enum, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';

import { UserRole } from '../utils/constants';
import { School } from './school.entity';

@Entity()
export class User {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  id!: string;

  @Property({ unique: true })
  email!: string;

  @Property()
  hashedPassword!: string;

  @Enum({ items: () => UserRole, nativeEnumName: 'user_role', default: UserRole.SCHOOL })
  role!: UserRole;

  @ManyToOne(() => School)
  school!: School;

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}
