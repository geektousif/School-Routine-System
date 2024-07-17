import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';

// import { errorResponse } from '../utils/apiResponse';

const validateRequest = (schema: AnyZodObject) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('req.body: ', req.body);
    await schema.parseAsync(req.body);
    next();
  } catch (error: any) {
    // TODO fix any

    next(error);
  }
};

export default validateRequest;
