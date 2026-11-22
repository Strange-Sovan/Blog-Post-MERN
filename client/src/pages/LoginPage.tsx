import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLogin } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MdArrowForward, MdAutoStories, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { FaGoogle, FaFacebook } from 'react-icons/fa';
import { HiMail, HiLockClosed } from 'react-icons/hi';
import { BackButton } from '@/components/ui/BackButton';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginForm) => {
    loginMutation.mutate(data, { onSuccess: () => navigate('/') });
  };

  return (
    <div className="page-shell flex min-h-[88vh] items-center justify-center">
      <div className="w-full max-w-md">
        <BackButton label="Back to previous page" />

        <div className="overflow-hidden rounded-3xl shadow-2xl shadow-indigo-950/15">
          {/* Header panel */}
          <div className="relative overflow-hidden px-8 py-10 text-center text-white">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0f0e1f] via-[#1e1b55] to-[#4c3ba0]" />
            <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-violet-500/20 blur-2xl" />
            <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-indigo-500/15 blur-xl" />
            <div className="relative">
              <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/20 shadow-lg">
                <MdAutoStories size={28} />
              </div>
              <h1 className="text-3xl font-black tracking-tight">Welcome back</h1>
              <p className="mt-2 text-indigo-200 text-sm">Your next great read is waiting.</p>
            </div>
          </div>

          {/* Form panel */}
          <div className="bg-white px-8 py-8">
            <p className="mb-6 text-center text-sm font-semibold text-slate-500">Sign in to your account</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email */}
              <div>
                <label className="form-label inline-flex items-center gap-2">
                  <HiMail size={15} className="text-violet-500" /> Email address
                </label>
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    {...register('email')}
                    className="h-11 rounded-xl pl-4 border-slate-200 bg-slate-50 focus:border-violet-500 focus:ring-violet-500/20"
                  />
                </div>
                {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="form-label inline-flex items-center gap-2">
                  <HiLockClosed size={15} className="text-violet-500" /> Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    {...register('password')}
                    className="h-11 rounded-xl pr-12 border-slate-200 bg-slate-50 focus:border-violet-500 focus:ring-violet-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute inset-y-0 right-0 grid w-11 place-items-center text-muted-foreground transition hover:text-violet-600"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>}
              </div>

              {/* Error */}
              {loginMutation.error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-center text-sm text-red-600">
                  {(loginMutation.error as any)?.response?.data?.message || 'Login failed. Please check credentials.'}
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full h-11 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 font-bold text-white shadow-lg shadow-violet-500/25 hover:-translate-y-0.5 transition"
              >
                {loginMutation.isPending ? 'Signing in...' : <span className="flex items-center justify-center gap-2">Sign in <MdArrowForward size={16} /></span>}
              </Button>

              {/* Divider */}
              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200" /></div>
                <div className="relative flex justify-center text-xs"><span className="bg-white px-3 font-semibold text-slate-400">Or continue with</span></div>
              </div>

              {/* OAuth */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => (window.location.href = '/api/v1/auth/google')}
                  className="flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:border-blue-300"
                >
                  <FaGoogle size={16} className="text-blue-500" /> Google
                </button>
                <button
                  type="button"
                  onClick={() => (window.location.href = '/api/v1/auth/facebook')}
                  className="flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:border-blue-500"
                >
                  <FaFacebook size={16} className="text-blue-700" /> Facebook
                </button>
              </div>

              <p className="text-center text-sm text-muted-foreground pt-1">
                Don&apos;t have an account?{' '}
                <Link to="/register" className="font-bold text-violet-600 hover:underline">
                  Create one <MdArrowForward size={14} className="inline" />
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
