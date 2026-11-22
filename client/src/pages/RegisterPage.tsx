import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRegister } from '@/hooks/useAuth';
import { Input } from '@/components/ui/input';
import { MdArrowForward, MdAutoStories, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { HiMail, HiLockClosed, HiUser } from 'react-icons/hi';
import { BackButton } from '@/components/ui/BackButton';

const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(50, 'Name must be 50 characters or fewer')
    .regex(/^[\p{L} ]+$/u, 'Name can only contain letters and spaces'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'At least 8 characters')
    .regex(/[A-Z]/, 'One uppercase letter required')
    .regex(/[0-9]/, 'One number required'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});
type RegisterForm = z.infer<typeof registerSchema>;

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const registerMutation = useRegister();
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterForm) =>
    registerMutation.mutate(
      { name: data.name, email: data.email, password: data.password },
      { onSuccess: () => navigate('/') },
    );

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
              <h1 className="text-3xl font-black tracking-tight">Join the conversation</h1>
              <p className="mt-2 text-sm text-indigo-200">Create an account and share your story.</p>
            </div>
          </div>

          {/* ── Form ── */}
          <div className="bg-card px-8 py-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name */}
              <div>
                <label className="form-label inline-flex items-center gap-1.5">
                  <HiUser size={14} className="text-primary" /> Full name
                  <span className="text-destructive" aria-hidden="true">*</span>
                </label>
                <Input placeholder="John Doe" {...register('name')} className="form-input" required />
                {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="form-label inline-flex items-center gap-1.5">
                  <HiMail size={14} className="text-primary" /> Email address
                  <span className="text-destructive" aria-hidden="true">*</span>
                </label>
                <Input type="email" placeholder="you@example.com" {...register('email')} className="form-input" required />
                {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="form-label inline-flex items-center gap-1.5">
                  <HiLockClosed size={14} className="text-primary" /> Password
                  <span className="text-destructive" aria-hidden="true">*</span>
                </label>
                <div className="relative">
                  <Input type={showPwd ? 'text' : 'password'}
                    placeholder="Min 8 chars, 1 uppercase, 1 digit"
                    {...register('password')} className="form-input pr-12" required />
                  <button type="button" onClick={() => setShowPwd((v) => !v)}
                    className="absolute inset-y-0 right-0 grid w-11 place-items-center text-muted-foreground transition hover:text-primary">
                    {showPwd ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>}
              </div>

              {/* Confirm password */}
              <div>
                <label className="form-label inline-flex items-center gap-1.5">
                  <HiLockClosed size={14} className="text-primary" /> Confirm password
                  <span className="text-destructive" aria-hidden="true">*</span>
                </label>
                <div className="relative">
                  <Input type={showConfirmPwd ? 'text' : 'password'} placeholder="Re-enter password"
                    {...register('confirmPassword')} className="form-input pr-12" required />
                  <button type="button" onClick={() => setShowConfirmPwd((visible) => !visible)}
                    aria-label={showConfirmPwd ? 'Hide confirm password' : 'Show confirm password'}
                    aria-pressed={showConfirmPwd}
                    className="absolute inset-y-0 right-0 grid w-11 place-items-center text-muted-foreground transition hover:text-primary">
                    {showConfirmPwd ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="mt-1 text-xs text-destructive">{errors.confirmPassword.message}</p>}
              </div>

              {/* Error */}
              {registerMutation.error && (
                <div className="rounded-xl border border-destructive/25 bg-destructive/8 p-3 text-center text-sm text-destructive">
                  {(registerMutation.error as any)?.response?.data?.message || 'Registration failed.'}
                </div>
              )}

              {/* Submit */}
              <button type="submit" disabled={registerMutation.isPending} className="btn-primary w-full justify-center">
                {registerMutation.isPending ? 'Creating account…' : <><span>Create account</span> <MdArrowForward size={16} /></>}
              </button>

              <p className="pt-1 text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="font-bold text-primary hover:underline">Sign in here</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
