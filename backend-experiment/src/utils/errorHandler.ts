import { Request, Response, NextFunction } from "express";
import { ErrorResponse } from "./apiResponse";

// Define custom error types if needed
interface CustomError extends Error {
  statusCode?: number;
}

const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = { ...err };
  error.message = err.message;

  // Log the error for debugging (in development)
  if (process.env.NODE_ENV === "development") {
    console.error(err);
  }

  // Handle specific error types
  if (err.name === "CastError") {
    error = new ErrorResponse("Resource not found", 404);
  }

  //   if (err.name === 'ValidationError') {
  //     const message = Object.values(err.errors).map(val => val.message).join(', ');
  //     error = new ErrorResponse(message, 400);
  //   }

  //   // Handle duplicate key errors
  //   if (err.code === 11000) {
  //     error = new ErrorResponse('Duplicate field value entered', 400);
  //   }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    error = new ErrorResponse("Invalid token", 401);
  }

  if (err.name === "TokenExpiredError") {
    error = new ErrorResponse("Token expired", 401);
  }

  // Send the error response
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export default errorHandler;
