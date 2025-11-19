// middleware/errorHandler.ts
import { Request, Response, NextFunction } from "express";
import { isCelebrateError } from "celebrate";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (isCelebrateError(err)) {
    const details: any = {};

    err.details.forEach((value, key) => {
      details[key] = value.details.map((d) => d.message);
    });

    return res.status(400).json({
      EC: 1,
      EM: "VALIDATION_ERROR",
      errors: details,
    });
  }
  if (
    err.name === "UnauthorizedError" ||
    err.name === "JsonWebTokenError" ||
    err.name === "TokenExpiredError"
  ) {
    return res
      .status(401)
      .json({ EC: 1, EM: "UNAUTHORIZED", details: err.message });
  }

  console.error(err);
  return res.status(500).json({ EC: 1, EM: "INTERNAL_SERVER_ERROR" });
}
