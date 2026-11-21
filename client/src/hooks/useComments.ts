import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commentApi } from '../api/comment.api';
import { useToast } from '../components/ui/toast';
import { getApiErrorMessage } from '../lib/apiError';

export const useComments = (postId: string, page = 1) =>
  useQuery({
    queryKey: ['comments', postId, page],
    queryFn: () => commentApi.getByPost(postId, page),
    enabled: !!postId,
  });

export const useCreateComment = (postId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (content: string) => commentApi.create(postId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      toast('Comment posted', 'success');
    },
    onError: (error) => toast(getApiErrorMessage(error, 'Could not post your comment.'), 'error'),
  });
};

export const useUpdateComment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: ({ id, content }: { id: string; content: string }) => commentApi.update(id, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      toast('Comment updated', 'success');
    },
    onError: (error) => toast(getApiErrorMessage(error, 'Could not update the comment.'), 'error'),
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (id: string) => commentApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      toast('Comment deleted', 'success');
    },
    onError: (error) => toast(getApiErrorMessage(error, 'Could not delete the comment.'), 'error'),
  });
};
