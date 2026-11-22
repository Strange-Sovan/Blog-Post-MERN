import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { AdminRoute } from './AdminRoute';

const HomePage        = lazy(() => import('@/pages/HomePage').then((m) => ({ default: m.HomePage })));
const AllPostsPage    = lazy(() => import('@/pages/AllPostsPage').then((m) => ({ default: m.AllPostsPage })));
const LoginPage       = lazy(() => import('@/pages/LoginPage').then((m) => ({ default: m.LoginPage })));
const RegisterPage    = lazy(() => import('@/pages/RegisterPage').then((m) => ({ default: m.RegisterPage })));
const ForgotPasswordPage = lazy(() => import('@/pages/ForgotPasswordPage').then((m) => ({ default: m.ForgotPasswordPage })));
const ResetPasswordPage = lazy(() => import('@/pages/ResetPasswordPage').then((m) => ({ default: m.ResetPasswordPage })));
const AuthSuccessPage = lazy(() => import('@/pages/AuthSuccessPage').then((m) => ({ default: m.AuthSuccessPage })));
const PostDetailPage  = lazy(() => import('@/pages/PostDetailPage').then((m) => ({ default: m.PostDetailPage })));
const CreatePostPage  = lazy(() => import('@/pages/CreatePostPage').then((m) => ({ default: m.CreatePostPage })));
const EditPostPage    = lazy(() => import('@/pages/EditPostPage').then((m) => ({ default: m.EditPostPage })));
const AdminDashboard  = lazy(() => import('@/pages/admin/AdminDashboard').then((m) => ({ default: m.AdminDashboard })));
const AdminUsers      = lazy(() => import('@/pages/admin/AdminUsers').then((m) => ({ default: m.AdminUsers })));
const AdminPosts      = lazy(() => import('@/pages/admin/AdminPosts').then((m) => ({ default: m.AdminPosts })));
const AdminComments   = lazy(() => import('@/pages/admin/AdminComments').then((m) => ({ default: m.AdminComments })));

const Spinner = () => (
  <div className="flex h-56 items-center justify-center">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
  </div>
);

/* ── Public layout: Navbar + Footer ── */
const PublicLayout: React.FC = () => (
  <div className="flex min-h-screen flex-col bg-background">
    <Navbar />
    <main className="flex-1">
      <Suspense fallback={<Spinner />}>
        <Outlet />
      </Suspense>
    </main>
    <footer className="border-t border-border bg-card/70 backdrop-blur-sm">
      <div className="mx-auto flex max-w-screen-2xl flex-col items-center gap-2 px-4 py-6 text-center text-sm text-muted-foreground sm:flex-row sm:justify-center sm:gap-8 sm:px-5 lg:px-6">
        <span>
          <span className="font-black bg-clip-text text-transparent" style={{ backgroundImage: 'var(--grad-primary)' }}>
            BlogMERN
          </span>
          {' '}— Stories worth sharing
        </span>
        <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
      </div>
    </footer>
  </div>
);

/* ── Admin layout wrapper ── */
const AdminWrapper: React.FC = () => (
  <Suspense fallback={<Spinner />}>
    <AdminLayout />
  </Suspense>
);

export const AppRouter: React.FC = () => (
  <BrowserRouter>
    <Routes>
      {/* Public + protected pages */}
      <Route element={<PublicLayout />}>
        <Route path="/"            element={<HomePage />} />
        <Route path="/posts"       element={<AllPostsPage />} />
        <Route path="/login"       element={<LoginPage />} />
        <Route path="/register"    element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/posts/:slug" element={<PostDetailPage />} />
        <Route path="/auth/success" element={<AuthSuccessPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/posts/create"    element={<CreatePostPage />} />
          <Route path="/posts/edit/:id"  element={<EditPostPage />} />
        </Route>
      </Route>

      {/* Admin pages (sidebar layout, no navbar) */}
      <Route element={<AdminRoute />}>
        <Route element={<AdminWrapper />}>
          <Route path="/admin"           element={<AdminDashboard />} />
          <Route path="/admin/users"     element={<AdminUsers />} />
          <Route path="/admin/posts"     element={<AdminPosts />} />
          <Route path="/admin/comments"  element={<AdminComments />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);
