import { axiosInstance } from './axiosInstance';
import { IApiResponse } from '../interfaces/IApiResponse';
import { IComment } from '../interfaces/IComment';

export const commentApi = {
  getByPost: async (postId: string, page = 1, limit = 10) => {
    const res = await axiosInstance.get<IApiResponse<IComment[]>>(
      `/posts/${postId}/comments?page=${page}&limit=${limit}`
    );
    return res.data;
  },
  create: async (postId: string, content: string) => {
    const res = await axiosInstance.post<IApiResponse<IComment>>(
      `/posts/${postId}/comments`,
      { content }
    );
    return res.data;
  },
  update: async (commentId: string, content: string) => {
    const res = await axiosInstance.put<IApiResponse<IComment>>(
      `/posts/comments/${commentId}`,
      { content }
    );
    return res.data;
  },
  delete: async (commentId: string) => {
    const res = await axiosInstance.delete<IApiResponse>(`/posts/comments/${commentId}`);
    return res.data;
  },
};

