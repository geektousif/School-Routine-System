import express, { Request, Response, CookieOptions } from "express";
import Router from "express-promise-router";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { DI } from "../index";
import { User, UserRole } from "../entity/user.entity";
import { ErrorResponse, successResponse } from "../utils/apiResponse";
import asyncHandler from "../utils/asyncHandler";
import authMiddleware from "../middleware/auth.middleware";

const router = Router();

const cookieOptions = {
  httpOnly: true,
  secure: true,
} satisfies CookieOptions;

router.post(
  "/register",
  asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new ErrorResponse("Email and password are required", 400);
    }

    const existingUser = await DI.userRepo.findOne({ email });

    if (existingUser) {
      throw new ErrorResponse("User already exists", 409);
    }

    const user = DI.em.create(User, {
      email,
      password,
      role: UserRole.SCHOOL,
    });
    await DI.em.flush();
    return res.status(201).json(successResponse(user, "User created"));
  })
);

router.post(
  "/login",
  asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new ErrorResponse("Email and password are required", 400);
    }

    const user = await DI.userRepo.findOne(
      { email },
      { populate: ["password"] }
    );
    if (!user) {
      throw new ErrorResponse("Invalid email or password", 400);
    }

    const passwordMatch = await user.verifyPassword(password);
    if (!passwordMatch) {
      throw new ErrorResponse("Invalid email or password", 400);
    }

    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      String(process.env.JWT_ACCESS_SECRET),
      { expiresIn: process.env.JWT_ACCESS_EXPIRY }
    );

    const refreshToken = jwt.sign(
      { id: user.id, role: user.role },
      String(process.env.JWT_REFRESH_SECRET),
      { expiresIn: process.env.JWT_REFRESH_EXPIRY }
    );

    user.refreshToken = refreshToken;
    await DI.em.flush();

    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json(
        successResponse({ user, accessToken, refreshToken }, "Login successful")
      );
  })
);

router.get(
  "/me",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const user = req.user as User;
    return res.status(200).json(successResponse(user, "User retrieved"));
  })
);

router.get(
  "/logout",
  authMiddleware,
  asyncHandler(async (_req, res) => {
    // TODO Both tokens are invalidated on the server.
    return res
      .status(200)
      .clearCookie("accessToken", cookieOptions)
      .clearCookie("refreshToken", cookieOptions)
      .json(successResponse(null, "Logout successful"));
  })
);

router.get(
  "/refresh",
  asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new ErrorResponse("Unauthorized", 401);
    }
    let decoded: any;
    try {
      decoded = jwt.verify(
        refreshToken,
        String(process.env.JWT_REFRESH_SECRET)
      );
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new ErrorResponse("Refresh Token Expired", 401);
      }
      throw new ErrorResponse("Invalid Refresh Token", 401);
    }
    const user = await DI.userRepo.findOne({ id: decoded.id });
    if (!user) {
      throw new ErrorResponse("User Not Found", 401);
    }

    // LATER  Check if the refresh token has been used before with something like user.usedRefreshTokens = [];
    const newAccessToken = jwt.sign(
      { id: user.id, role: user.role },
      String(process.env.JWT_ACCESS_SECRET),
      { expiresIn: process.env.JWT_ACCESS_EXPIRY }
    );

    const newRefreshToken = jwt.sign(
      { id: user.id, role: user.role },
      String(process.env.JWT_REFRESH_SECRET),
      { expiresIn: process.env.JWT_REFRESH_EXPIRY }
    );

    user.refreshToken = newRefreshToken;
    await DI.em.flush();

    return res
      .status(200)
      .cookie("accessToken", newAccessToken, cookieOptions)
      .cookie("refreshToken", newRefreshToken, cookieOptions)
      .json(
        successResponse(
          { user, newAccessToken, newRefreshToken },
          "Refresh successful"
        )
      );
  })
);

export default router;
