import { Request } from "express";
import { User, UserRole } from "../entity/user.entity";
import { JwtPayload } from "jsonwebtoken";

export interface CustomRequest extends Request {
  user?: User;
}

export interface CustomPayload extends JwtPayload {
  id?: string;
  role?: UserRole;
}
