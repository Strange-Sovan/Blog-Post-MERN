import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi, LoginInput, RegisterInput } from '../api/auth.api';
import { useAuthStore } from '../store/authStore';
import { useToast } from '../components/ui/toast';
import { getApiErrorMessage } from '../lib/apiError';

export const useLogin = () => {
  const { setUser } = useAuthStore();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: LoginInput) => authApi.login(data),
    onSuccess: (res) => {
      if (res.data) setUser(res.data);
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      toast('Welcome back', 'success', 'You are now signed in.');
    },
    onError: (error) => toast(getApiErrorMessage(error, 'Unable to sign in.'), 'error'),
  });
};

export const useRegister = () => {
  const { setUser } = useAuthStore();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: RegisterInput) => authApi.register(data),
    onSuccess: (res) => {
      if (res.data) setUser(res.data);
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      toast('Your account is ready', 'success', 'Welcome to the community.');
    },
    onError: (error) => toast(getApiErrorMessage(error, 'Unable to create your account.'), 'error'),
  });
};
