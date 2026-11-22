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
    <div className="page-shell flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-sm rounded-3xl border border-white/80 bg-white/80 p-8 text-center shadow-lg" role="status">
        <span className="sr-only">Completing authentication...</span>
        <div className="mx-auto mb-5 h-14 w-14 animate-pulse rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100" />
        <div className="mx-auto mb-3 h-5 w-48 animate-pulse rounded bg-slate-100" />
        <div className="mx-auto h-4 w-64 max-w-full animate-pulse rounded bg-slate-100" />
        <p className="mt-5 text-sm font-medium text-muted-foreground">Completing authentication...</p>
      </div>
    </div>
  );
};

