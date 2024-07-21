import { EntityName, EventArgs, EventSubscriber } from "@mikro-orm/core";

import { School } from "../entity/school.entity";
import { User } from "../entity/user.entity";

class UserSubscriber implements EventSubscriber {
  getSubscribedEntities(): EntityName<User>[] {
    return [User];
  }

  async afterCreate(args: EventArgs<User>): Promise<void> {
    const { entity: user, em } = args;

    if (user.role === "school") {
      const school = em.create(School, { admin: user }); // TODO communicate through School Repository instead of EntityManager
      user.school = school;
      await em.flush();
    }
  }
}

export default UserSubscriber;
