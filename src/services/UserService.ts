import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import db from '../models/index';
dotenv.config();

const saltRounds: number = 10;

interface IUser {
  id?: number;
  email: string;
  password?: string;
  firstName: string;
  lastName?: string;
  address?: string;
  phoneNumber?: string;
  gender?: boolean;
  image?: string;
  roleId?: string;
  positionId?: string;
}

interface LoginResponse {
  EC: number;
  EM?: string;
  access_token?: string;
  user?: {
    email: string;
    firstName: string;
    lastName?: string;
  };
}

const createUserService = async (name: string, email: string, password: string): Promise<IUser | null> => {
  try {
    const user = await db.User.findOne({ where: { email } });
    if (user) {
      console.log(">>> user exist, chọn 1 email khác: ", email);
      return null;
    }

    const hashPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await db.User.create({
      email: email,
      password: hashPassword,
      firstName: name, 
      roleId: "User" 
    });
    
    const result: IUser = newUser.get({ plain: true });
    delete result.password;
    return result;

  } catch (error: any) {
    console.log(error);
    return null;
  }
}

const loginService = async (email: string, password: string): Promise<LoginResponse | null> => {
  try {
    const user = await db.User.findOne({
      where: { email: email },
      raw: true,
    });

    if (user) {
      const isMatchPassword = await bcrypt.compare(password, user.password);

      if (isMatchPassword) {
        const payload = {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        };

        const jwtSecret = process.env.JWT_SECRET as string;
        const jwtExpireEnv = process.env.JWT_EXPIRE;

        if (!jwtSecret || !jwtExpireEnv) {
          console.error("Lỗi: JWT_SECRET hoặc JWT_EXPIRE chưa được định nghĩa trong file .env");
          return null;
        }

        const expiresInValue: string | number = isNaN(Number(jwtExpireEnv))
          ? jwtExpireEnv
          : Number(jwtExpireEnv);

        const options: SignOptions = {
          expiresIn: expiresInValue as any
        };
        const access_token = jwt.sign(
          payload,
          jwtSecret,
          options
        );

        return {
          EC: 0,
          access_token,
          user: {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
          }
        };
      } else {
        return {
          EC: 2,
          EM: "Email/Password không hợp lệ"
        };
      }
    } else {
      return {
        EC: 1,
        EM: "Email/Password không hợp lệ"
      };
    }
  } catch (error: any) {
    console.log(error);
    return null;
  }
}

const getUserService = async (): Promise<IUser[] | null> => {
  try {
    const result: IUser[] = await db.User.findAll({
      attributes: {
        exclude: ['password']
      },
      raw: true,
    });

    return result;
  } catch (error: any) {
    console.log(error);
    return null;
  }
}

export {
  createUserService,
  loginService,
  getUserService
}