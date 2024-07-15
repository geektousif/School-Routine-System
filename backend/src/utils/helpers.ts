import { NextFunction, Request, Response } from 'express';

type AnyFunction = (...args: any) => any;

export const asyncHandler = (func: AnyFunction) => (req: Request, res: Response, next: NextFunction) => {
  return Promise.resolve(func(req, res, next)).catch(next);
};
