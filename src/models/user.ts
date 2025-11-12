import mongoose, { Document, Model } from "mongoose";

export interface IUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  address?: string;
  phoneNumber?: string;
  gender?: boolean;
  image?: string;
  roleId?: string;
  positionId?: string;
}

export interface IUserDocument extends IUser, Document {}

const userSchema = new mongoose.Schema<IUserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    gender: {
      type: Boolean,
    },
    image: {
      type: String,
    },
    roleId: {
      type: String,
    },
    positionId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const User: Model<IUserDocument> =
  (mongoose.models.User as Model<IUserDocument>) ||
  mongoose.model<IUserDocument>("User", userSchema);

export default User;