import express, { Router, Request, Response } from "express";
import {
  createUser,
  handleLogin,
  getUser,
  getAccount,
  handleForgotPassword,
  handleResetPassword,
} from "../controller/userController";

import auth from "../middleware/auth";
import delay from "../middleware/delay";
import { loginValidation, registerValidation } from "../middleware/validation";

const routerAPI: Router = express.Router();

routerAPI.get("/", (req: Request, res: Response) => {
  return res.status(200).json("Hello world api");
});

routerAPI.post("/register", registerValidation, createUser);

routerAPI.post("/login", loginValidation, handleLogin);

routerAPI.post("/forgot-password", handleForgotPassword);

routerAPI.post("/reset-password", handleResetPassword);

routerAPI.get("/user", auth, getUser);

routerAPI.get("/account", auth, delay, getAccount);

export default routerAPI;
