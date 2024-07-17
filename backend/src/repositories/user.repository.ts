import { EntityRepository } from '@mikro-orm/postgresql';

import { CreateUserDto } from '../dtos/user.dto';
import { User } from '../entities/user.entity';

class UserRepository extends EntityRepository<User> {
  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({ email });
  }

  async createUser(userData: CreateUserDto): Promise<User> {
    const user = this.em.create(User, userData);
    await this.em.flush();
    return user;
  }

  // REVIEW for optimum
  // async emailExists(email: string): Promise<boolean> {
  //   const count = await this.count({ email });
  //   return count > 0;
  // }
}

export default UserRepository;
