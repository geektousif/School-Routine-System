import { Response, NextFunction } from "express";
import { CustomRequest } from "../types/authHelper.type";

type AsyncFunction = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => Promise<any>;

const asyncHandler = (asyncFunction: AsyncFunction) => {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    Promise.resolve(asyncFunction(req, res, next)).catch((err) => next(err));
  };
};

export default asyncHandler;
