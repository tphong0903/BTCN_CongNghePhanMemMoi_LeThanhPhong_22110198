import express, { Router, Request, Response } from 'express';
import { 
    createUser, 
    handleLogin, 
    getUser, 
    getAccount 
} from '../controller/userController';

import auth from '../middleware/auth';
import delay from '../middleware/delay';

const routerAPI: Router = express.Router();

routerAPI.get("/", (req: Request, res: Response) => {
    return res.status(200).json("Hello world api");
});

routerAPI.post("/register", createUser);

routerAPI.post("/login", handleLogin);

routerAPI.get("/user", auth, getUser);

routerAPI.get("/account", auth, delay, getAccount);

export default routerAPI;