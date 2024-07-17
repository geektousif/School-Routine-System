import { BeforeCreate, BeforeUpdate, Entity, EntityRepositoryType, Enum, OneToOne, Property } from '@mikro-orm/core';
import bcrypt from 'bcrypt';

import { BaseEntity } from '../common/base.entity';
import UserRepository from '../repositories/user.repository';
import { UserRole } from '../utils/constants';
import { School } from './school.entity';

@Entity({ repository: () => UserRepository })
export class User extends BaseEntity<'role'> {
  [EntityRepositoryType]?: UserRepository;

  @Property({ unique: true })
  email!: string;

  @Property({ hidden: true, lazy: true })
  password!: string;

  @Enum({ items: () => UserRole, nativeEnumName: 'user_role', default: UserRole.SCHOOL })
  role!: UserRole;

  @OneToOne(() => School, (school) => school.admin, { owner: true, nullable: true }) // REVIEW maybe the relation => not needed due to TsMorph
  school?: School;

  @BeforeCreate()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  async verifyPassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}
