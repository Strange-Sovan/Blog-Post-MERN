import { axiosInstance } from './axiosInstance';
import { IApiResponse } from '../interfaces/IApiResponse';
import { IPost } from '../interfaces/IPost';

export interface CreatePostInput {
  title: string;
  content: string;
  thumbnailUrl?: string;
  thumbnail?: File;
}

export interface UpdatePostInput {
  title?: string;
  content?: string;
  thumbnailUrl?: string;
  thumbnail?: File;
}

const toPostFormData = (data: CreatePostInput | UpdatePostInput): FormData => {
  const formData = new FormData();
  if (data.title !== undefined) formData.append('title', data.title);
  if (data.content !== undefined) formData.append('content', data.content);
  if (data.thumbnailUrl !== undefined) formData.append('thumbnailUrl', data.thumbnailUrl);
  if (data.thumbnail) formData.append('thumbnail', data.thumbnail);
  return formData;
};

export const postApi = {
  getAll: async (page = 1, limit = 10) => {
    const res = await axiosInstance.get<IApiResponse<IPost[]>>(`/posts?page=${page}&limit=${limit}`);
    return res.data;
  },
  getBySlug: async (slug: string) => {
    const res = await axiosInstance.get<IApiResponse<IPost>>(`/posts/${slug}`);
    return res.data;
  },
  create: async (data: CreatePostInput) => {
    const body = data.thumbnail ? toPostFormData(data) : data;
    const res = await axiosInstance.post<IApiResponse<IPost>>('/posts', body);
    return res.data;
  },
  update: async (id: string, data: UpdatePostInput) => {
    const body = data.thumbnail ? toPostFormData(data) : data;
    const res = await axiosInstance.put<IApiResponse<IPost>>(`/posts/${id}`, body);
    return res.data;
  },
  delete: async (id: string) => {
    const res = await axiosInstance.delete<IApiResponse>(`/posts/${id}`);
    return res.data;
  },
};
