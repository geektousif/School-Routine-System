import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler";
import { ErrorResponse } from "../utils/apiResponse";
import { CustomPayload, CustomRequest } from "../types/authHelper.type";
import { DI } from "../index";
import { User, UserRole } from "../entity/user.entity";

const authMiddleware = asyncHandler(async (req, res, next) => {
  try {
    let token;
    if (
      (req.header("Authorization") &&
        req.header("Authorization")?.startsWith("Bearer")) ||
      req.cookies.accessToken
    ) {
      token =
        req.header("Authorization") &&
        req.header("Authorization")?.startsWith("Bearer")
          ? req.header("Authorization")?.split(" ")[1]
          : req.cookies.accessToken;
    }

    if (!token) {
      throw new ErrorResponse("Unauthorized", 401);
    }

    let decoded: CustomPayload;
    try {
      decoded = jwt.verify(
        token,
        String(process.env.JWT_ACCESS_SECRET)
      ) as CustomPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new ErrorResponse("Access Token Expired", 401);
      }
      throw new ErrorResponse("Invalid Access Token", 401);
    }

    if (decoded.exp && decoded.exp < Date.now() / 1000) {
      throw new ErrorResponse("Access Token Expired", 401);
    }

    const user = await DI.em.findOne(User, {
      id: decoded.id,
    });

    if (!user) {
      throw new ErrorResponse("User not found", 401);
    }

    if (user.role !== decoded.role) {
      throw new ErrorResponse("Invalid user role", 403);
    }

    req.user = user;
    // req.token = token;  // Store token for potential blacklisting

    next();
  } catch (error: any) {
    if (error instanceof ErrorResponse) {
      return res
        .status(error.status)
        .json({ success: false, error: error.message });
    }
    // Log the error securely (don't expose in production)
    console.error(
      "Auth Middleware Error:",
      error instanceof Error ? error.message : "Unknown error"
    );
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
});

export default authMiddleware;

// Token blacklist (in a ideal situation, this should be in a database or Redis)
// const tokenBlacklist = new Set<string>();
// Utility function to blacklist a token (to be used when logging out)
// export const blacklistToken = (token: string) => {
//     tokenBlacklist.add(token);
//   };
