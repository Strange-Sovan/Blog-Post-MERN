import { axiosInstance } from './axiosInstance';
import { IApiResponse } from '../interfaces/IApiResponse';
import { IUser } from '../interfaces/IUser';

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export const authApi = {
  register: async (data: RegisterInput) => {
    const res = await axiosInstance.post<IApiResponse<IUser>>('/auth/register', data);
    return res.data;
  },
  login: async (data: LoginInput) => {
    const res = await axiosInstance.post<IApiResponse<IUser>>('/auth/login', data);
    return res.data;
  },
  logout: async () => {
    const res = await axiosInstance.post<IApiResponse>('/auth/logout');
    return res.data;
  },
  getMe: async () => {
    const res = await axiosInstance.get<IApiResponse<IUser>>('/auth/me');
    return res.data;
  },
  refresh: async () => {
    const res = await axiosInstance.post<IApiResponse<IUser>>('/auth/refresh');
    return res.data;
  },
};

