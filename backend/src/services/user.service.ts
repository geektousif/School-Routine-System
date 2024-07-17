import { CreateUserDto } from '../dtos/user.dto';
import UserRepository from '../repositories/user.repository';
import { AppError } from '../utils/errors';

class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async registerUser(userData: CreateUserDto) {
    const existingUser = await this.userRepository.findByEmail(userData.email); // REVIEW rather than findbyEmail we can do it using count method in repository
    if (existingUser) throw new AppError('User already exists', 409);

    const user = await this.userRepository.createUser(userData);
    return user; //REVIEW return type UserResponseDto
  }
}

export default UserService;
