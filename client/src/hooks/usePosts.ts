import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postApi, CreatePostInput, UpdatePostInput } from '../api/post.api';
import { useToast } from '../components/ui/toast';
import { getApiErrorMessage } from '../lib/apiError';

export const usePosts = (page = 1, limit = 10) =>
  useQuery({
    queryKey: ['posts', page, limit],
    queryFn: () => postApi.getAll(page, limit),
    staleTime: 1000 * 60,
  });

export const usePost = (slug: string) =>
  useQuery({
    queryKey: ['post', slug],
    queryFn: () => postApi.getBySlug(slug),
    enabled: !!slug,
  });

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (data: CreatePostInput) => postApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast('Story published', 'success');
    },
    onError: (error) => toast(getApiErrorMessage(error, 'Could not publish the story.'), 'error'),
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePostInput }) => postApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post'] });
      toast('Changes saved', 'success');
    },
    onError: (error) => toast(getApiErrorMessage(error, 'Could not save your changes.'), 'error'),
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (id: string) => postApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast('Story removed', 'success');
    },
    onError: (error) => toast(getApiErrorMessage(error, 'Could not delete the story.'), 'error'),
  });
};
