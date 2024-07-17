import { Controllers } from '../controllers';
import UserController from '../controllers/user.controller';
import UserService from '../services/user.service';
import { Services } from './db.config';

export function readyControllers(db: Services): Controllers {
  const userService = new UserService(db.user);
  const userController = new UserController(userService);

  return {
    userController,
  };
}
