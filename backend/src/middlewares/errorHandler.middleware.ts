import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

import { errorResponse } from '../utils/apiResponse';
import { AppError } from '../utils/errors';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json(errorResponse(err.message));
  }

  // TODO if (err instanceof ZodError) {
  // return res.status(400).json(errorResponse(err.errors[0].message));
  // }

  if (err instanceof ZodError) {
    const errorMessages = err.errors.map((issue: any) => `${issue.path.join('.')} is ${issue.message}`);
    const errorMessageString = errorMessages.join(', ');
    return res.status(400).json(errorResponse(errorMessageString));
  }

  return res.status(500).json(errorResponse('Internal Server Error'));
};
