import 'dotenv/config';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const auth = (req: Request, res: Response, next: NextFunction) => {
    const whiteLists = ["/v1/api/register", "/v1/api/login"];
    
    if (whiteLists.find(item => item === req.originalUrl)) {
        next();
    } else {
        if (req.headers?.authorization?.split(' ')?.[1]) {
            const token = req.headers.authorization.split(' ')[1];
            const jwtSecret = process.env.JWT_SECRET as string;

            try {
                const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
                
                // @ts-ignore
                req.user = {
                    email: decoded.email,
                    name: decoded.name,
                    createdBy: "tphong",
                    role: decoded.role
                };

                console.log(">>> check token: ", decoded);
                next();
            } catch (error) {
                return res.status(401).json({
                    message: "Token bị hết hạn hoặc không hợp lệ"
                });
            }
        } else {
            return res.status(401).json({
                message: "Bạn chưa truyền Access Token ở header/Hoặc token bị hết hạn"
            });
        }
    }
}

export default auth;