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

const getProductApi = (
  page: number,
  limit: number,
  search?: string,
  brandName?: string,
  categoryName?: string,
  sortBy?: string,
  sortOrder?: string
) => {
  const URL_API = "/v1/api/products";
  const res: any = axios.get<any>(URL_API, {
    params: { page, limit, search, brandName, categoryName, sortBy, sortOrder },
  });
  return res;
};

export const createProductApi = (data: any) => {
  return axios.post("/v1/api/products", data);
};

export const getProductDetailApi = (id: number) => {
  return axios.get(`/v1/api/products/${id}`);
};

export const getSimilarProductsApi = (id: number) => {
  return axios.get(`/v1/api/products/${id}/similar`);
};

export const getProductCommentsApi = (productId: number) => {
  return axios.get(`/v1/api/comments?productId=${productId}`);
};

export const toggleFavoriteApi = (productId: number) => {
  return axios.post(`/v1/api/favorites/toggle`, { productId });
};

export const getMyFavoritesApi = () => {
  return axios.get(`/v1/api/favorites`);
};

export const createCommentApi = (data: any) => {
  return axios.post(`/v1/api/comments`, data);
};

export {
  createUserApi,
  loginApi,
  getUserApi,
  forgotPasswordApi,
  getProductApi,
};
