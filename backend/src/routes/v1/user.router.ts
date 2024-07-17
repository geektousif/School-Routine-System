import { Router } from 'express';

import UserController from '../../controllers/user.controller';
import { createUserSchema } from '../../dtos/user.dto';
import validateRequest from '../../middlewares/validateRequest.middleware';

export default (userController: UserController) => {
  const router = Router();

  router.post('/register', validateRequest(createUserSchema), userController.registerUser);

  return router;
};
