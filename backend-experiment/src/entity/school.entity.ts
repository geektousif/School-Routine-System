import { Entity, OneToOne, PrimaryKey, Property } from "@mikro-orm/core";

import { User } from "./user.entity";

@Entity()
export class School {
  @PrimaryKey({ type: "uuid", defaultRaw: "gen_random_uuid()" })
  id!: string;

  @Property()
  name?: string;

  @Property()
  address?: string;

  @OneToOne(() => User, (user) => user.school, { nullable: true })
  admin!: User;

  @Property()
  phoneNumber?: number;

  // @OneToMany(() => User, (user) => user.school)
  // users = new Collection<User>(this);
}
