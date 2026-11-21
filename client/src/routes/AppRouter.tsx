import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { ProtectedRoute } from './ProtectedRoute';
import { AdminRoute } from './AdminRoute';

const HomePage = lazy(() => import('@/pages/HomePage').then((module) => ({ default: module.HomePage })));
const LoginPage = lazy(() => import('@/pages/LoginPage').then((module) => ({ default: module.LoginPage })));
const RegisterPage = lazy(() => import('@/pages/RegisterPage').then((module) => ({ default: module.RegisterPage })));
const AuthSuccessPage = lazy(() => import('@/pages/AuthSuccessPage').then((module) => ({ default: module.AuthSuccessPage })));
const PostDetailPage = lazy(() => import('@/pages/PostDetailPage').then((module) => ({ default: module.PostDetailPage })));
const CreatePostPage = lazy(() => import('@/pages/CreatePostPage').then((module) => ({ default: module.CreatePostPage })));
const EditPostPage = lazy(() => import('@/pages/EditPostPage').then((module) => ({ default: module.EditPostPage })));
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard').then((module) => ({ default: module.AdminDashboard })));
const AdminUsers = lazy(() => import('@/pages/admin/AdminUsers').then((module) => ({ default: module.AdminUsers })));
const AdminPosts = lazy(() => import('@/pages/admin/AdminPosts').then((module) => ({ default: module.AdminPosts })));

export const AppRouter: React.FC = () => (
  <BrowserRouter>
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<div className="page-shell"><div className="h-56 animate-pulse rounded-3xl bg-muted" /></div>}>
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/posts/:slug" element={<PostDetailPage />} />
          <Route path="/auth/success" element={<AuthSuccessPage />} />

          {/* Protected (Must be logged in) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/posts/create" element={<CreatePostPage />} />
            <Route path="/posts/edit/:id" element={<EditPostPage />} />
          </Route>

          {/* Admin Protected (Must be admin) */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/posts" element={<AdminPosts />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </Suspense>
      </main>
      <footer className="border-t bg-white/70 py-8 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} BlogMERN. Stories worth sharing.
      </footer>
    </div>
  </BrowserRouter>
);
