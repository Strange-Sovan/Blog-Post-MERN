import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { PageSkeleton } from '@/components/ui/PageSkeleton';

export const AdminRoute: React.FC = () => {
  const { isAuthenticated, isAdmin, isLoading } = useAuthStore();

  if (isLoading) {
    return <PageSkeleton />;
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return <Outlet />;
};

