import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../api/admin.api';
import { useToast } from '../components/ui/toast';
import { getApiErrorMessage } from '../lib/apiError';

export const useAdminStats = () =>
  useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () => adminApi.getStats(),
  });

export const useAdminUsers = (page = 1, limit = 10, search = '') =>
  useQuery({
    queryKey: ['admin', 'users', page, limit, search],
    queryFn: () => adminApi.getUsers(page, limit, search),
  });

export const useAdminPosts = (page = 1, limit = 10, search = '') =>
  useQuery({
    queryKey: ['admin', 'posts', page, limit, search],
    queryFn: () => adminApi.getPosts(page, limit, search),
  });

export const useAdminDeleteUser = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (id: string) => adminApi.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
      toast('User removed', 'success');
    },
    onError: (error) => toast(getApiErrorMessage(error, 'Could not remove the user.'), 'error'),
  });
};

export const useAdminDeletePost = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (id: string) => adminApi.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'posts'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
      toast('Post removed', 'success');
    },
    onError: (error) => toast(getApiErrorMessage(error, 'Could not remove the post.'), 'error'),
  });
};
