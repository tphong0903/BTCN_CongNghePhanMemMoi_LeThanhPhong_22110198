import { Request, Response, NextFunction } from "express";

export const authorize = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ EC: 1, EM: "UNAUTHORIZED" });
    }

    if (!user.role || !allowedRoles.includes(user.role)) {
      return res.status(403).json({ EC: 1, EM: "FORBIDDEN" });
    }

    return next();
  };
};
