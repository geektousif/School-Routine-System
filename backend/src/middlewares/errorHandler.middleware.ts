import { NextFunction, Request, Response } from 'express';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      status: 'error',
      message: err.message,
      data: {},
    });
  }
  res.status(500).json({
    success: false,
    status: 'error',
    message: 'Internal Server Error',
    data: {},
  });
};
