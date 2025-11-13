import { Request, Response, NextFunction } from 'express';

const delay = (req: Request, res: Response, next: NextFunction) => {
    setTimeout(() => {
        try {
            if (req.headers.authorization) {
                const token = req.headers.authorization.split(' ')[1];
                console.log(">>> check token (delay): ", token);
            }
            next();
        } catch (error) {
            console.error("Error in delay middleware: ", error);
            next(error); // Chuyển lỗi cho Express error handler
        }
    }, 3000);
}

export default delay;