import { Request, Response } from 'express';
import { 
    createUserService, 
    loginService, 
    getUserService 
} from '../services/UserService';

const createUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        const data = await createUserService(name, email, password);
        return res.status(200).json(data);
    } catch (error: any) {
        console.error("Error in createUser: ", error.message);
        return res.status(500).json({ EC: -1, EM: "Error from server" });
    }
}

const handleLogin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const data = await loginService(email, password);
        return res.status(200).json(data);
    } catch (error: any) {
        console.error("Error in handleLogin: ", error.message);
        return res.status(500).json({ EC: -1, EM: "Error from server" });
    }
}

const getUser = async (req: Request, res: Response) => {
    try {
        const data = await getUserService();
        return res.status(200).json(data);
    } catch (error: any) {
        console.error("Error in getUser: ", error.message);
        return res.status(500).json({ EC: -1, EM: "Error from server" });
    }
}

const getAccount = async (req: Request, res: Response) => {
    try {
        // Giả sử middleware 'auth' đã xử lý và gắn 'req.user'
        // Bạn cần định nghĩa lại kiểu 'Request' của Express để 'user' được công nhận
        // @ts-ignore
        return res.status(200).json(req.user);
    } catch (error: any) {
        console.error("Error in getAccount: ", error.message);
        return res.status(500).json({ EC: -1, EM: "Error from server" });
    }
}

export {
    createUser,
    handleLogin,
    getUser,
    getAccount
}