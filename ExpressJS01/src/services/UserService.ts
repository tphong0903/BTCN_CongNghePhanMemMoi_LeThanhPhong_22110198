import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import crypto from "crypto";
import db from "../models/index";
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

const createUserService = async (
  name: string,
  email: string,
  password: string
): Promise<IUser | null> => {
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
      roleId: "User",
    });

    const result: IUser = newUser.get({ plain: true });
    delete result.password;
    return result;
  } catch (error: any) {
    console.log(error);
    return null;
  }
};

const loginService = async (
  email: string,
  password: string
): Promise<LoginResponse | null> => {
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
          lastName: user.lastName,
          role: "user",
        };

        const jwtSecret = process.env.JWT_SECRET as string;
        const jwtExpireEnv = process.env.JWT_EXPIRE;

        if (!jwtSecret || !jwtExpireEnv) {
          console.error(
            "Lỗi: JWT_SECRET hoặc JWT_EXPIRE chưa được định nghĩa trong file .env"
          );
          return null;
        }

        const expiresInValue: string | number = isNaN(Number(jwtExpireEnv))
          ? jwtExpireEnv
          : Number(jwtExpireEnv);

        const options: SignOptions = {
          expiresIn: expiresInValue as any,
        };
        const access_token = jwt.sign(payload, jwtSecret, options);

        return {
          EC: 0,
          access_token,
          user: {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
          },
        };
      } else {
        return {
          EC: 2,
          EM: "Email/Password không hợp lệ",
        };
      }
    } else {
      return {
        EC: 1,
        EM: "Email/Password không hợp lệ",
      };
    }
  } catch (error: any) {
    console.log(error);
    return null;
  }
};

const getUserService = async (): Promise<IUser[] | null> => {
  try {
    const result: IUser[] = await db.User.findAll({
      attributes: {
        exclude: ["password"],
      },
      raw: true,
    });

    return result;
  } catch (error: any) {
    console.log(error);
    return null;
  }
};

const forgotPasswordService = async (
  email: string
): Promise<{ EC: number; EM?: string; token?: string }> => {
  try {
    const user = await db.User.findOne({
      where: { email: email },
      raw: true,
    });

    if (!user) {
      return {
        EC: 1,
        EM: "Email không tồn tại trong hệ thống",
      };
    }

    // Generate reset token (32 bytes = 64 hex characters)
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash the token for storage
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Set expiry time (10 minutes)
    const resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await db.User.update(
      {
        resetPasswordToken: hashedToken,
        resetPasswordTokenExpiry: resetTokenExpiry,
      },
      { where: { email: email } }
    );

    return {
      EC: 0,
      token: resetToken,
    };
  } catch (error: any) {
    console.log(error);
    return {
      EC: -1,
      EM: "Error from server",
    };
  }
};

const resetPasswordService = async (
  token: string,
  newPassword: string
): Promise<{ EC: number; EM?: string }> => {
  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await db.User.findOne({
      where: { resetPasswordToken: hashedToken },
      raw: true,
    });

    if (!user) {
      return {
        EC: 1,
        EM: "Token không hợp lệ hoặc đã hết hạn",
      };
    }

    // Check if token has expired
    if (
      user.resetPasswordTokenExpiry &&
      new Date(user.resetPasswordTokenExpiry) < new Date()
    ) {
      return {
        EC: 2,
        EM: "Token đã hết hạn",
      };
    }

    // Hash the new password
    const hashPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password and clear reset token
    await db.User.update(
      {
        password: hashPassword,
        resetPasswordToken: null,
        resetPasswordTokenExpiry: null,
      },
      { where: { id: user.id } }
    );

    return {
      EC: 0,
      EM: "Mật khẩu đã được cập nhật thành công",
    };
  } catch (error: any) {
    console.log(error);
    return {
      EC: -1,
      EM: "Error from server",
    };
  }
};

export {
  createUserService,
  loginService,
  getUserService,
  forgotPasswordService,
  resetPasswordService,
};
