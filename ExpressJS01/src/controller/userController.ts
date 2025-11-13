import { Request, Response } from 'express';
import { 
    createUserService, 
    loginService, 
    getUserService,
    forgotPasswordService,
    resetPasswordService 
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
        // @ts-ignore
        return res.status(200).json(req.user);
    } catch (error: any) {
        console.error("Error in getAccount: ", error.message);
        return res.status(500).json({ EC: -1, EM: "Error from server" });
    }
}

const handleForgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ EC: -1, EM: "Email là bắt buộc" });
        }
        const data = await forgotPasswordService(email);
        return res.status(200).json(data);
    } catch (error: any) {
        console.error("Error in handleForgotPassword: ", error.message);
        return res.status(500).json({ EC: -1, EM: "Error from server" });
    }
}

const handleResetPassword = async (req: Request, res: Response) => {
    try {
        const { token, newPassword } = req.body;
        if (!token || !newPassword) {
            return res.status(400).json({ EC: -1, EM: "Token và mật khẩu mới là bắt buộc" });
        }
        const data = await resetPasswordService(token, newPassword);
        return res.status(200).json(data);
    } catch (error: any) {
        console.error("Error in handleResetPassword: ", error.message);
        return res.status(500).json({ EC: -1, EM: "Error from server" });
    }
}

export {
    createUser,
    handleLogin,
    getUser,
    getAccount,
    handleForgotPassword,
    handleResetPassword
}