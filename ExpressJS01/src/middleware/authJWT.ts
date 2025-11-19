// middleware/authJwt.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "CHANGE_ME_SECRET";

export interface JwtPayloadCustom {
  id: number;
  email: string;
  name?: string;
  iat?: number;
  exp?: number;
  role: string;
  createdBy: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayloadCustom;
    }
  }
}

export const authenticateJwt = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ EC: 1, EM: "NO_TOKEN_PROVIDED" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, SECRET) as JwtPayloadCustom;
    req.user = payload;
    return next();
  } catch (err: any) {
    return res
      .status(401)
      .json({ EC: 1, EM: "INVALID_TOKEN", details: err.message });
  }
};
