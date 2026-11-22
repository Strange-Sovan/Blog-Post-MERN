import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { PageSkeleton } from '@/components/ui/PageSkeleton';

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return <PageSkeleton />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

