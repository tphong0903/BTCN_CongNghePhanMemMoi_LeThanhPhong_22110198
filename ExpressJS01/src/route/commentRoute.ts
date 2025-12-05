import express from "express";
import { getComments, createComment } from "../controller/commentController";
import { authenticateJwt } from "../middleware/authJWT";
import { globalLimiter } from "../middleware/rateLimiter";

const commentRoute = express.Router();

commentRoute.get("/comments", globalLimiter, getComments);

commentRoute.post("/comments", authenticateJwt, createComment);

export default commentRoute;
