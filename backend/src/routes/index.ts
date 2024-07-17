import { Router } from 'express';

import { Controllers } from '../controllers';
import userRouter from './v1/user.router';

export default (controllers: Controllers) => {
  const router = Router();

  router.use('/v1/users', userRouter(controllers.userController));

  return router;
};
