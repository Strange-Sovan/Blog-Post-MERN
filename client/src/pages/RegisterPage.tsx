import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRegister } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MdArrowForward, MdAutoStories, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { HiMail, HiLockClosed, HiUser } from 'react-icons/hi';
import { BackButton } from '@/components/ui/BackButton';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type RegisterForm = z.infer<typeof registerSchema>;

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const registerMutation = useRegister();
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterForm) => {
    registerMutation.mutate(
      { name: data.name, email: data.email, password: data.password },
      { onSuccess: () => navigate('/') },
    );
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
              <h1 className="text-3xl font-black tracking-tight">Join the conversation</h1>
              <p className="mt-2 text-indigo-200 text-sm">Create an account and share your story.</p>
            </div>
          </div>

          {/* Form panel */}
          <div className="bg-white px-8 py-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name */}
              <div>
                <label className="form-label inline-flex items-center gap-2">
                  <HiUser size={15} className="text-violet-500" /> Full name
                </label>
                <Input
                  placeholder="John Doe"
                  {...register('name')}
                  className="h-11 rounded-xl border-slate-200 bg-slate-50 focus:border-violet-500 focus:ring-violet-500/20"
                />
                {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="form-label inline-flex items-center gap-2">
                  <HiMail size={15} className="text-violet-500" /> Email address
                </label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  {...register('email')}
                  className="h-11 rounded-xl border-slate-200 bg-slate-50 focus:border-violet-500 focus:ring-violet-500/20"
                />
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
                    placeholder="Min. 8 chars (1 uppercase, 1 digit)"
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

              {/* Confirm password */}
              <div>
                <label className="form-label inline-flex items-center gap-2">
                  <HiLockClosed size={15} className="text-violet-500" /> Confirm password
                </label>
                <Input
                  type="password"
                  placeholder="Re-enter your password"
                  {...register('confirmPassword')}
                  className="h-11 rounded-xl border-slate-200 bg-slate-50 focus:border-violet-500 focus:ring-violet-500/20"
                />
                {errors.confirmPassword && <p className="mt-1 text-xs text-destructive">{errors.confirmPassword.message}</p>}
              </div>

              {/* Error */}
              {registerMutation.error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-center text-sm text-red-600">
                  {(registerMutation.error as any)?.response?.data?.message || 'Registration failed.'}
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                disabled={registerMutation.isPending}
                className="w-full h-11 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 font-bold text-white shadow-lg shadow-violet-500/25 hover:-translate-y-0.5 transition"
              >
                {registerMutation.isPending ? 'Creating account...' : <span className="flex items-center justify-center gap-2">Create account <MdArrowForward size={16} /></span>}
              </Button>

              <p className="text-center text-sm text-muted-foreground pt-1">
                Already have an account?{' '}
                <Link to="/login" className="font-bold text-violet-600 hover:underline">
                  Sign in here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
