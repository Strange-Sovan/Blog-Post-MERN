import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLogin } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight, BookOpen, Eye, EyeOff, Facebook, LockKeyhole, Mail } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginForm) => {
    loginMutation.mutate(data, {
      onSuccess: () => navigate('/'),
    });
  };

  return (
    <div className="page-shell flex min-h-[78vh] items-center justify-center">
      <Card className="w-full max-w-md overflow-hidden rounded-3xl border-0 shadow-2xl shadow-indigo-950/10">
        <div className="hero-panel px-8 py-8 text-center text-white">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-white/15 text-white ring-1 ring-white/20"><BookOpen size={26} /></div>
          <CardTitle className="text-3xl font-extrabold text-white">Welcome back</CardTitle>
          <CardDescription className="mt-2 text-indigo-100">Be ready to explore stories!</CardDescription>
        </div>
        <CardContent className="px-7 py-7 sm:px-8">
          <div className="mb-5 text-center">
            <p className="text-sm font-bold">Sign in to your account</p>
            <p className="mt-1 text-xs text-muted-foreground">Your next great read is waiting.</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="form-label inline-flex items-center gap-2">
                <Mail size={14} /> Email address
              </label>
              <Input
                type="email"
                placeholder="you@example.com"
                {...register('email')}
                className="h-11 rounded-xl"
              />
              {errors.email && (
                <p className="text-destructive text-xs mt-1">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label className="form-label inline-flex items-center gap-2">
                <LockKeyhole size={14} /> Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password')}
                  className="h-11 rounded-xl pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="absolute inset-y-0 right-0 grid w-11 place-items-center text-muted-foreground transition hover:text-primary"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-destructive text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            {loginMutation.error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded text-destructive text-sm text-center">
                {(loginMutation.error as any)?.response?.data?.message || 'Login failed. Please check credentials.'}
              </div>
            )}

            <Button type="submit" className="w-full rounded-xl" disabled={loginMutation.isPending}>
              {loginMutation.isPending ? 'Signing in...' : <>Sign in <ArrowRight size={16} /></>}
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or authenticate with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl"
                onClick={() => (window.location.href = '/api/v1/auth/google')}
              >
                <span className="font-bold text-base text-blue-600">G</span> Google
              </Button>
              <Button
                type="button"
                variant="outline"
                className="rounded-xl"
                onClick={() => (window.location.href = '/api/v1/auth/facebook')}
              >
                <Facebook size={16} className="text-blue-600" /> Facebook
              </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground pt-2">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="text-primary font-medium hover:underline">
                Create an account <ArrowRight size={14} className="inline" />
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
