import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

export const AuthSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const { refetchUser } = useAuthStore();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        await refetchUser();
      } finally {
        navigate('/', { replace: true });
      }
    };
    handleAuth();
  }, [refetchUser, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      <p className="text-muted-foreground text-sm font-medium">Completing authentication, please wait...</p>
    </div>
  );
};

