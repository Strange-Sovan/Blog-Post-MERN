import { axiosInstance } from './axiosInstance';
import { IApiResponse } from '../interfaces/IApiResponse';
import { IUser } from '../interfaces/IUser';
import { IPost } from '../interfaces/IPost';

export interface DashboardStats {
  totalUsers: number;
  totalPosts: number;
  totalComments: number;
}

export const adminApi = {
  getStats: async () => {
    const res = await axiosInstance.get<IApiResponse<DashboardStats>>('/admin/stats');
    return res.data;
  },
  getUsers: async (page = 1, limit = 10) => {
    const res = await axiosInstance.get<IApiResponse<IUser[]>>(`/admin/users?page=${page}&limit=${limit}`);
    return res.data;
  },
  getPosts: async (page = 1, limit = 10) => {
    const res = await axiosInstance.get<IApiResponse<IPost[]>>(`/admin/posts?page=${page}&limit=${limit}`);
    return res.data;
  },
  deleteUser: async (id: string) => {
    const res = await axiosInstance.delete<IApiResponse>(`/admin/users/${id}`);
    return res.data;
  },
  deletePost: async (id: string) => {
    const res = await axiosInstance.delete<IApiResponse>(`/admin/posts/${id}`);
    return res.data;
  },
};

