import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLogin } from '@/hooks/useAuth';
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
  const [showPwd, setShowPwd] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginForm) =>
    loginMutation.mutate(data, { onSuccess: () => navigate('/') });

  return (
    <div className="page-shell flex min-h-[88vh] items-center justify-center">
      <div className="w-full max-w-[26rem]">
        <BackButton label="Back" />

        <div className="overflow-hidden rounded-3xl border border-border shadow-2xl shadow-primary/10">
          {/* ── Dark header ── */}
          <div className="hero-panel relative overflow-hidden px-8 py-10 text-center text-white">
            <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-violet-500/20 blur-2xl" />
            <div className="absolute -bottom-6 -left-6 h-28 w-28 rounded-full bg-indigo-500/15 blur-xl" />
            <div className="relative">
              <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/20 shadow-lg">
                <MdAutoStories size={28} />
              </div>
              <h1 className="text-3xl font-black tracking-tight">Welcome back</h1>
              <p className="mt-2 text-sm text-indigo-200">Your next great read is waiting.</p>
            </div>
          </div>

          {/* ── Form ── */}
          <div className="bg-card px-8 py-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email */}
              <div>
                <label className="form-label inline-flex items-center gap-1.5">
                  <HiMail size={14} className="text-primary" /> Email address
                  <span className="text-destructive" aria-hidden="true">*</span>
                </label>
                <Input type="email" placeholder="you@example.com"
                  {...register('email')}
                  className="form-input" required />
                {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="form-label inline-flex items-center gap-1.5">
                  <HiLockClosed size={14} className="text-primary" /> Password
                  <span className="text-destructive" aria-hidden="true">*</span>
                </label>
                <div className="relative">
                  <Input type={showPwd ? 'text' : 'password'} placeholder="••••••••"
                    {...register('password')}
                    className="form-input pr-12" required />
                  <button type="button" onClick={() => setShowPwd((v) => !v)}
                    className="absolute inset-y-0 right-0 grid w-11 place-items-center text-muted-foreground transition hover:text-primary"
                    aria-label={showPwd ? 'Hide' : 'Show'}>
                    {showPwd ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>}
              </div>

              <p className="-mt-2 text-right text-sm">
                <Link to="/forgot-password" className="font-semibold text-primary hover:underline">
                  Forgot password?
                </Link>
              </p>

              {/* Error banner */}
              {loginMutation.error && (
                <div className="rounded-xl border border-destructive/25 bg-destructive/8 p-3 text-center text-sm text-destructive">
                  {(loginMutation.error as any)?.response?.data?.message || 'Login failed. Please check credentials.'}
                </div>
              )}

              {/* Submit */}
              <button type="submit" disabled={loginMutation.isPending} className="btn-primary w-full justify-center">
                {loginMutation.isPending ? 'Signing in…' : <><span>Sign in</span> <MdArrowForward size={16} /></>}
              </button>

              {/* Divider */}
              <div className="relative my-1">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-card px-3 font-semibold text-muted-foreground">Or continue with</span>
                </div>
              </div>

              {/* OAuth */}
              <div className="grid grid-cols-2 gap-3">
                <button type="button"
                  onClick={() => (window.location.href = '/api/v1/auth/google')}
                  className="flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-muted/40 text-sm font-bold text-foreground transition hover:bg-muted">
                  <FaGoogle size={15} className="text-blue-500" /> Google
                </button>
                <button type="button"
                  onClick={() => (window.location.href = '/api/v1/auth/facebook')}
                  className="flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-muted/40 text-sm font-bold text-foreground transition hover:bg-muted">
                  <FaFacebook size={15} className="text-blue-700" /> Facebook
                </button>
              </div>

              <p className="pt-1 text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link to="/register" className="font-bold text-primary hover:underline">
                  Create one <MdArrowForward size={13} className="inline" />
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
