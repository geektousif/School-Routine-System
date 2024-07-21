import {
  BeforeCreate,
  BeforeUpdate,
  Entity,
  EntityRepositoryType,
  Enum,
  EventArgs,
  OneToOne,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import bcrypt from "bcrypt";

import { School } from "./school.entity";

export enum UserRole {
  SUPERADMIN = "superadmin",
  SCHOOL = "school",
}

@Entity()
export class User {
  @PrimaryKey({ type: "uuid", defaultRaw: "gen_random_uuid()" })
  id!: string;

  @Property({ unique: true })
  email!: string;

  @Property({ hidden: true, lazy: true })
  password!: string;

  @Enum({
    items: () => UserRole,
    nativeEnumName: "user_role",
    default: UserRole.SCHOOL,
  })
  role!: UserRole;

  @OneToOne(() => School, (school) => school.admin, {
    owner: true,
    nullable: true,
  }) // REVIEW maybe the relation => not needed due to TsMorph
  school?: School;

  @Property({ nullable: true })
  refreshToken?: string;

  @Property()
  createdAt? = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt? = new Date();

  @BeforeCreate()
  @BeforeUpdate()
  async hashPassword(args: EventArgs<any>) {
    const password = args.changeSet?.payload.password;
    if (password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  async verifyPassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}
