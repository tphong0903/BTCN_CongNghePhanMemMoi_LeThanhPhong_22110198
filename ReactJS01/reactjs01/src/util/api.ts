import axios from "./axios.customize";

interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  EC: number;
  EM?: string;
  access_token?: string;
  user?: {
    email: string;
    firstName: string;
    lastName: string;
  };
}

interface IUser {
  id: number;
  email?: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  phoneNumber?: string;
  gender?: boolean;
  image?: string;
  roleId?: string;
  positionId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}


const createUserApi = (name: string, email: string, password: string) => {
  const URL_API = "/v1/api/register";
  const data: CreateUserPayload = {
    name,
    email,
    password,
  };

  return axios.post<any>(URL_API, data);
};

const loginApi = (email: string, password: string) => {
  const URL_API = "/v1/api/login";
  const data: LoginPayload = {
    email,
    password,
  };
  return axios.post<LoginResponse>(URL_API, data);
};

const getUserApi = () => {
  const URL_API = "/v1/api/user";
  return axios.get<IUser[]>(URL_API);
};

const forgotPasswordApi = (email: string) => {
  const URL_API = "/v1/api/forgot-password";
  return axios.post<any>(URL_API, { email });
};

export { createUserApi, loginApi, getUserApi, forgotPasswordApi };