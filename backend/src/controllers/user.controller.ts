import UserService from '../services/user.service';
import { asyncHandler } from '../utils/helpers';

class UserController {
  constructor(private readonly userService: UserService) {}

  registerUser = asyncHandler(async (req, res) => {
    const user = await this.userService.registerUser(req.body);
    return res.status(201).json({
      success: true,
      status: 'success',
      message: 'User created successfully',
      data: user,
    });
  });
}

export default UserController;
